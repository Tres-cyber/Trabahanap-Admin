from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from admin_api.models.documents import Admin, AdminCreate, LoginRequest, TotalUsers, User, Job, TotalJobs, Applicant, TotalApplicants, ApplicantJobSeeker, JobSeeker, MonthlyData, ReportValidation, FinalReport, ReportResponse
from admin_api.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token, get_current_active_admin
from datetime import datetime, timedelta
from beanie import PydanticObjectId
from typing import List, Dict, Any
import logging
import json

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection: {websocket.client}. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected: {websocket.client}. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        disconnected_sockets = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {connection.client}: {e}. Marking for disconnect.")
                disconnected_sockets.append(connection)
        
        for ws in disconnected_sockets:
            self.disconnect(ws)

manager = ConnectionManager()

async def broadcast_notification(type: str, message: str, details: Dict[str, Any] = None):
    payload = {"type": type, "message": message, "details": details or {}}
    logger.info(f"Broadcasting notification: {payload}")
    await manager.broadcast(json.dumps(payload))

async def get_admin_from_query_token(token: str = Query(None)):
    if not token:
        # Allow anonymous access for now if no token, or raise WebSocketDisconnect
        logger.warning("WebSocket connection attempt without token.")
        # raise WebSocketDisconnect(code=403, reason="Token required") 
        return {"token_user": "anonymous_websocket_user"} # Or handle as unauthenticated
    
    logger.info(f"WebSocket attempting connection with token: {token[:10]}...")
    # In a real app, you would validate the token and fetch the admin user.
    # from admin_api.auth.auth_utils import get_current_active_admin_from_token # Example
    # admin = await get_current_active_admin_from_token(token)
    # if not admin:
    #     raise WebSocketDisconnect(code=403, reason="Invalid token or admin not found")
    # return admin
    return {"token_user": "admin_placeholder_ws"} # Return a placeholder admin object

router = APIRouter(
    # prefix="/admin", 
    tags=["admin"]    
)


@router.post("/create", response_model=Admin)
async def create_admin(admin_data: AdminCreate):
    hashed_password = get_password_hash(admin_data.password)
    admin_doc = Admin(
        full_name=admin_data.full_name,
        email=admin_data.email,
        password=hashed_password
    )
    await admin_doc.insert()
    return admin_doc

@router.post("/login")
async def login(login_data: LoginRequest):
    admin = await Admin.find_one(Admin.email == login_data.email)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(login_data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_data = {"sub": admin.email} 
    access_token = create_access_token(data=access_token_data)
    refresh_token_data = {"sub": admin.email}
    refresh_token = create_refresh_token(data=refresh_token_data)
    
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.get("/get_total_users", response_model=TotalUsers)
async def get_total_users():
    total_users = await User.count()
    return {"total_users": total_users}


@router.get("/get_total_jobs", response_model=TotalJobs)
async def get_total_jobs():
    total_jobs = await Job.count()
    return {"total_jobs": total_jobs}


@router.get("/get_total_applicants", response_model=TotalApplicants)
async def get_total_applicants():
    total_applicants = await Applicant.count()
    return {"total_applicants": total_applicants}


@router.get("/get_all_applicants")
async def get_all_applicants():
    all_applicants = await Applicant.find_all().to_list()
    return all_applicants


@router.get("/get_applicant/{applicant_id}")
async def get_applicant(applicant_id: str):
    try:
        applicant = await Applicant.get(applicant_id)
        if not applicant:
            raise HTTPException(status_code=404, detail="Applicant not found")
        return applicant
    except Exception as e:
        print(f"Error fetching applicant {applicant_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching applicant: {str(e)}")


@router.put("/update_verification_status/{applicant_id}")
async def update_verification_status(applicant_id: str, status: str):
    applicant = await Applicant.get(applicant_id)
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    if status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    applicant.verification_status = status
    await applicant.save()
    
    if status == "rejected":
        await broadcast_notification(
            type="verification_rejected", 
            message=f"Applicant {applicant.email} has been rejected.", 
            details={"applicantId": str(applicant.id), "status": "rejected"}
        )
        return {"status": "success", "message": f"Applicant verification rejected"}
    
    if status == "verified":
        user = User(
            first_name=applicant.first_name,
            middle_name=applicant.middle_name,
            last_name=applicant.last_name,
            suffix_name=applicant.suffix_name,
            gender=applicant.gender,
            birth_date=applicant.birth_date,
            age=applicant.age,
            email=applicant.email,
            password=applicant.password,  
            profile_picture=applicant.profile_picture,
            barangay=applicant.barangay,
            street=applicant.street,
            house_number=applicant.house_number,
            user_type=applicant.user_type,
            id_validation_front_image=applicant.id_validation_front_image,
            id_validation_back_image=applicant.id_validation_back_image,
            id_type=applicant.id_type,
            jobs_done=applicant.jobs_done,
            joined_at=applicant.joined_at,
            verification_status="verified"
        )
        
        await user.insert()
        
        if applicant.user_type.lower() == "job-seeker":
            db = ApplicantJobSeeker.get_motor_collection().database
            
            applicant_job_seeker_data = await db.applicant_jobseeker.find_one({"applicantId": str(applicant.id)})
            
            if not applicant_job_seeker_data:
                applicant_job_seeker_data = await db.applicant_jobseeker.find_one({"applicantId": applicant.id})
                
                if not applicant_job_seeker_data:
                    all_seekers_data = await db.applicant_jobseeker.find({}).to_list(length=100)
                    applicant_id_str = str(applicant.id)
                    
                    for seeker in all_seekers_data:
                        seeker_applicant_id = seeker.get('applicantId')
                        if seeker_applicant_id and (seeker_applicant_id == applicant_id_str or str(seeker_applicant_id) == applicant_id_str):
                            applicant_job_seeker_data = seeker
                            break
            
            if applicant_job_seeker_data:
                job_seeker = JobSeeker(
                    user_id=str(user.id),
                    joined_at=applicant_job_seeker_data.get('joinedAt', datetime.utcnow()),
                    availability=applicant_job_seeker_data.get('availability', True),
                    hourly_rate=applicant_job_seeker_data.get('hourlyRate', "0"),
                    credentials=applicant_job_seeker_data.get('credentials'),
                    job_tags=applicant_job_seeker_data.get('jobTags', [])
                )
                
                await job_seeker.insert()
                
                await broadcast_notification(
                    type="verification_approved", 
                    message=f"Applicant {applicant.email} (Job Seeker) has been verified.", 
                    details={"applicantId": str(applicant.id), "status": "verified", "userType": "job-seeker"}
                )
                return {
                    "status": "success", 
                    "message": f"Job-seeker verification approved, user and job-seeker profiles created"
                }
            else:
                job_seeker = JobSeeker(
                    user_id=str(user.id),
                    joined_at=datetime.utcnow(),
                    availability=True,
                    hourly_rate="0",
                    credentials=None,
                    job_tags=[]
                )
                
                await job_seeker.insert()
                
                await broadcast_notification(
                    type="verification_approved", 
                    message=f"Applicant {applicant.email} (Job Seeker) has been verified (no tags).", 
                    details={"applicantId": str(applicant.id), "status": "verified", "userType": "job-seeker"}
                )
                return {
                    "status": "success", 
                    "message": f"Job-seeker verification approved, but no job tags found"
                }
        
        # For client or other types
        await broadcast_notification(
            type="verification_approved", 
            message=f"Applicant {applicant.email} (Client/Other) has been verified.", 
            details={"applicantId": str(applicant.id), "status": "verified", "userType": applicant.user_type}
        )
        return {"status": "success", "message": f"Client verification approved and user account created"}
    
    # Fallback for other status changes if any (e.g., back to pending, though not typical)
    await broadcast_notification(
        type="verification_updated", 
        message=f"Applicant {applicant.email} verification status updated to {status}.", 
        details={"applicantId": str(applicant.id), "status": status}
    )
    return {"status": "success", "message": f"Verification status updated to {status}"}


@router.get("/get_monthly_applications", response_model=MonthlyData)
async def get_monthly_applications():
    try:
        current_date = datetime.now()
        
        monthly_counts = [0] * 12
        
        all_applicants = await Applicant.find_all().to_list()
        print(f"Total applicants found: {len(all_applicants)}")
        
        for i in range(12):
            month = (current_date.month - i - 1) % 12 + 1
            year = current_date.year if current_date.month > i else current_date.year - 1
            
            start_date = datetime(year, month, 1, 0, 0, 0)
            
            if month == 12:
                end_date = datetime(year + 1, 1, 1, 0, 0, 0)
            else:
                end_date = datetime(year, month + 1, 1, 0, 0, 0)
            
            count = 0
            for applicant in all_applicants:
                if applicant.joined_at and start_date <= applicant.joined_at < end_date:
                    count += 1
            
            monthly_counts[month - 1] = count
        
        return {"monthly_data": monthly_counts}
        
    except Exception as e:
        print(f"Error getting monthly applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting monthly applications: {str(e)}")


@router.get("/get_monthly_users", response_model=MonthlyData)
async def get_monthly_users():
    try:
        current_date = datetime.now()
        
        monthly_counts = [0] * 12
        
        all_users = await User.find_all().to_list()
        print(f"Total users found: {len(all_users)}")
        
        for i in range(12):
            month = (current_date.month - i - 1) % 12 + 1
            year = current_date.year if current_date.month > i else current_date.year - 1
            
            start_date = datetime(year, month, 1, 0, 0, 0)
            
            if month == 12:
                end_date = datetime(year + 1, 1, 1, 0, 0, 0)
            else:
                end_date = datetime(year, month + 1, 1, 0, 0, 0)
            
            count = 0
            for user in all_users:
                if hasattr(user, 'verified_at') and user.verified_at and start_date <= user.verified_at < end_date:
                    count += 1
                    
            print(f"Month {month}/{year}: {count} verified users")
            
            monthly_counts[month - 1] = count
        
        return {"monthly_data": monthly_counts}
        
    except Exception as e:
        print(f"Error getting monthly users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting monthly users: {str(e)}")


@router.get("/me", response_model=Admin)
async def read_admin_me(current_admin: Admin = Depends(get_current_active_admin)):
    return current_admin


# --- Report Management Endpoints --- 

@router.get("/api/reports/pending", response_model=List[ReportResponse], summary="Get Pending User Reports")
async def get_pending_reports(current_admin: Admin = Depends(get_current_active_admin)):
    pending_reports_docs = await ReportValidation.find(ReportValidation.status == "pending").to_list()
    
    response_reports = []
    for report_doc in pending_reports_docs:
        reporter_name_str = "N/A"  # Default value
        reported_object_name_str = "N/A"  # Default value

        # Fetch reporter's name
        if report_doc.reporter: # This is a PydanticObjectId
            reporter_user = await User.get(report_doc.reporter) # User.get() takes PydanticObjectId
            if reporter_user:
                name_parts = []
                if reporter_user.first_name: name_parts.append(reporter_user.first_name)
                if reporter_user.middle_name: name_parts.append(reporter_user.middle_name)
                if reporter_user.last_name: name_parts.append(reporter_user.last_name)
                if reporter_user.suffix_name: name_parts.append(reporter_user.suffix_name)
                name = " ".join(name_parts).strip()
                reporter_name_str = name if name else f"User ID: {str(reporter_user.id)}"

        # Fetch reported object's name (assuming it's a User)
        if report_doc.reported_object_id: # This is a PydanticObjectId
            reported_user = await User.get(report_doc.reported_object_id)
            if reported_user:
                name_parts = []
                if reported_user.first_name: name_parts.append(reported_user.first_name)
                if reported_user.middle_name: name_parts.append(reported_user.middle_name)
                if reported_user.last_name: name_parts.append(reported_user.last_name)
                if reported_user.suffix_name: name_parts.append(reported_user.suffix_name)
                name = " ".join(name_parts).strip()
                reported_object_name_str = name if name else f"User ID: {str(reported_user.id)}"
        
        # Construct ReportResponse using aliased keys for fields that have them
        report_response_entry = ReportResponse(
            id=report_doc.id,  # 'id' has no alias in ReportResponse
            reportedObjectId=report_doc.reported_object_id, # Alias is reportedObjectId
            reporter=report_doc.reporter, # 'reporter' has no alias
            reason=report_doc.reason,
            status=report_doc.status,
            dateReported=report_doc.date_reported, # Alias is dateReported
            dateApproved=report_doc.date_approved, # Alias is dateApproved
            reporterName=reporter_name_str, # Alias is reporterName
            reportedObjectName=reported_object_name_str # Alias is reportedObjectName
        )
        response_reports.append(report_response_entry)
            
    return response_reports

@router.get("/api/reports/all", response_model=List[ReportResponse], summary="Get All User Reports")
async def get_all_reports(current_admin: Admin = Depends(get_current_active_admin)):
    all_report_docs = await ReportValidation.find_all().to_list()
    response_reports: List[ReportResponse] = []

    for report_doc in all_report_docs:
        reporter_name_str = "N/A"
        reported_object_name_str = "N/A"

        if report_doc.reporter:
            reporter_user = await User.get(report_doc.reporter)
            if reporter_user:
                name_parts = []
                if reporter_user.first_name: name_parts.append(reporter_user.first_name)
                if reporter_user.middle_name: name_parts.append(reporter_user.middle_name)
                if reporter_user.last_name: name_parts.append(reporter_user.last_name)
                if reporter_user.suffix_name: name_parts.append(reporter_user.suffix_name)
                name = " ".join(name_parts).strip()
                reporter_name_str = name if name else f"User ID: {str(reporter_user.id)}"

        if report_doc.reported_object_id:
            reported_user = await User.get(report_doc.reported_object_id)
            if reported_user:
                name_parts = []
                if reported_user.first_name: name_parts.append(reported_user.first_name)
                if reported_user.middle_name: name_parts.append(reported_user.middle_name)
                if reported_user.last_name: name_parts.append(reported_user.last_name)
                if reported_user.suffix_name: name_parts.append(reported_user.suffix_name)
                name = " ".join(name_parts).strip()
                reported_object_name_str = name if name else f"User ID: {str(reported_user.id)}"
        
        report_response_entry = ReportResponse(
            id=report_doc.id,
            reportedObjectId=report_doc.reported_object_id,
            reporter=report_doc.reporter,
            reason=report_doc.reason,
            status=report_doc.status,
            dateReported=report_doc.date_reported,
            dateApproved=report_doc.date_approved,
            reporterName=reporter_name_str,
            reportedObjectName=reported_object_name_str
        )
        response_reports.append(report_response_entry)
            
    return response_reports

@router.put("/api/reports/{report_id}/approve", response_model=ReportValidation, summary="Approve a User Report")
async def approve_report(report_id: PydanticObjectId, current_admin: Admin = Depends(get_current_active_admin)):
    report_to_approve = await ReportValidation.get(report_id)

    if not report_to_approve:
        raise HTTPException(status_code=404, detail=f"Report with id {report_id} not found")

    if report_to_approve.status != "pending":
        raise HTTPException(status_code=400, detail=f"Report {report_id} already processed. Status: {report_to_approve.status}")

    report_to_approve.status = "approved"
    report_to_approve.date_approved = datetime.utcnow()
    await report_to_approve.save()

    final_report_entry = FinalReport(
        original_report_id=str(report_to_approve.id), 
        reported_object_id=str(report_to_approve.reported_object_id), 
        reporter=str(report_to_approve.reporter), 
        reason=report_to_approve.reason,
        date_reported=report_to_approve.date_reported,
        date_approved=report_to_approve.date_approved 
    )
    await final_report_entry.insert()

    await broadcast_notification(
        type="report_approved", 
        message=f"Report ID {str(report_to_approve.id)} has been approved.", 
        details={"reportId": str(report_to_approve.id), "status": "approved"}
    )

    return report_to_approve

@router.put("/api/reports/{report_id}/reject", response_model=ReportValidation, summary="Reject a User Report")
async def reject_report(report_id: PydanticObjectId, current_admin: Admin = Depends(get_current_active_admin)):
    report_to_reject = await ReportValidation.get(report_id)

    if not report_to_reject:
        raise HTTPException(status_code=404, detail=f"Report with id {report_id} not found")

    if report_to_reject.status != "pending":
        raise HTTPException(status_code=400, detail=f"Report {report_id} already processed. Status: {report_to_reject.status}")

    report_to_reject.status = "rejected"
    await report_to_reject.save()

    await broadcast_notification(
        type="report_rejected", 
        message=f"Report ID {str(report_to_reject.id)} has been rejected.", 
        details={"reportId": str(report_to_reject.id), "status": "rejected"}
    )

    return report_to_reject

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket, admin: dict = Depends(get_admin_from_query_token)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text() # Keep connection alive, listen for client messages
            logger.info(f"Received message from {websocket.client} on /ws/notifications: {data}")
            # Optionally process client messages here
    except WebSocketDisconnect as e:
        logger.info(f"WebSocket {websocket.client} disconnected from /ws/notifications with code {e.code}: {e.reason}")
    except Exception as e:
        logger.error(f"Unexpected error with WebSocket {websocket.client} on /ws/notifications: {e}")
    finally:
        manager.disconnect(websocket)
