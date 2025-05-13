from fastapi import APIRouter, HTTPException
from admin_api.models.documents import Admin, AdminCreate, LoginRequest, TotalUsers, User, Job, TotalJobs, Applicant, TotalApplicants, ApplicantJobSeeker, JobSeeker, MonthlyData
from admin_api.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from datetime import datetime, timedelta

router = APIRouter()



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
    
    access_token_data = {"sub": admin.email} # Using email as the subject
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
        # Get the applicant by ID
        applicant = await Applicant.get(applicant_id)
        if not applicant:
            raise HTTPException(status_code=404, detail="Applicant not found")
        return applicant
    except Exception as e:
        # Log the error
        print(f"Error fetching applicant {applicant_id}: {str(e)}")
        # Re-raise for client
        raise HTTPException(status_code=500, detail=f"Error fetching applicant: {str(e)}")



@router.put("/update_verification_status/{applicant_id}")
async def update_verification_status(applicant_id: str, status: str):
    # Get the applicant
    applicant = await Applicant.get(applicant_id)
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    if status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    # Update verification_status
    applicant.verification_status = status
    await applicant.save()
    
    # If rejected, just update the status
    if status == "rejected":
        return {"status": "success", "message": f"Applicant verification rejected"}
    
    # If verified, create appropriate records based on applicant type
    if status == "verified":
        # Create a new user from the applicant data (common for all types)
        user = User(
            first_name=applicant.first_name,
            middle_name=applicant.middle_name,
            last_name=applicant.last_name,
            suffix_name=applicant.suffix_name,
            gender=applicant.gender,
            birth_date=applicant.birth_date,
            age=applicant.age,
            email=applicant.email,
            password=applicant.password,  # Password is already hashed from the applicant record
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
        
        # Insert the user
        await user.insert()
        
        # For job-seeker type applicants, create a JobSeeker record and transfer data
        if applicant.user_type.lower() == "job-seeker":
            # Access MongoDB directly through Beanie's motor client to bypass validation issues
            db = ApplicantJobSeeker.get_motor_collection().database
            
            # Try different ways to find the applicant_jobseeker record
            # First try with string ID
            applicant_job_seeker_data = await db.applicant_jobseeker.find_one({"applicantId": str(applicant.id)})
            
            # If not found, try with raw ID
            if not applicant_job_seeker_data:
                applicant_job_seeker_data = await db.applicant_jobseeker.find_one({"applicantId": applicant.id})
                
                # If still not found, try manual search
                if not applicant_job_seeker_data:
                    # Get all applicant job seekers
                    all_seekers_data = await db.applicant_jobseeker.find({}).to_list(length=100)
                    applicant_id_str = str(applicant.id)
                    
                    # Look for a match with either string or raw ID
                    for seeker in all_seekers_data:
                        seeker_applicant_id = seeker.get('applicantId')
                        if seeker_applicant_id and (seeker_applicant_id == applicant_id_str or str(seeker_applicant_id) == applicant_id_str):
                            applicant_job_seeker_data = seeker
                            break
            
            # If we found an applicant_jobseeker record, create a JobSeeker record with its data
            if applicant_job_seeker_data:
                job_seeker = JobSeeker(
                    user_id=str(user.id),
                    joined_at=applicant_job_seeker_data.get('joinedAt', datetime.utcnow()),
                    availability=applicant_job_seeker_data.get('availability', True),
                    hourly_rate=applicant_job_seeker_data.get('hourlyRate', "0"),
                    credentials=applicant_job_seeker_data.get('credentials'),
                    job_tags=applicant_job_seeker_data.get('jobTags', [])
                )
                
                # Save job seeker record
                await job_seeker.insert()
                
                return {
                    "status": "success", 
                    "message": f"Job-seeker verification approved, user and job-seeker profiles created"
                }
            else:
                # No applicant_job_seeker found, create a JobSeeker with default values
                job_seeker = JobSeeker(
                    user_id=str(user.id),
                    joined_at=datetime.utcnow(),
                    availability=True,
                    hourly_rate="0",
                    credentials=None,
                    job_tags=[]
                )
                
                # Save the job seeker
                await job_seeker.insert()
                
                # Return success message
                return {
                    "status": "success", 
                    "message": f"Job-seeker verification approved, but no job tags found"
                }
        
        # For regular client users, just return success message
        return {"status": "success", "message": f"Client verification approved and user account created"}
    
    # Default response (should not reach here)
    return {"status": "success", "message": f"Verification status updated to {status}"}


@router.get("/get_monthly_applications", response_model=MonthlyData)
async def get_monthly_applications():
    try:
        # Get the current month and year
        current_date = datetime.now()
        
        # Initialize counts list (one entry per month for the last 12 months)
        monthly_counts = [0] * 12
        
        # Get all applicants - we'll process them in memory for more reliable results
        all_applicants = await Applicant.find_all().to_list()
        print(f"Total applicants found: {len(all_applicants)}")
        
        # For each of the past 12 months, count applications in that month
        for i in range(12):
            # Calculate the month we're looking at (current month - i)
            month = (current_date.month - i - 1) % 12 + 1
            year = current_date.year if current_date.month > i else current_date.year - 1
            
            # Set start date to first day of month at 00:00:00
            start_date = datetime(year, month, 1, 0, 0, 0)
            
            # Set end date to first day of next month at 00:00:00
            if month == 12:
                end_date = datetime(year + 1, 1, 1, 0, 0, 0)
            else:
                end_date = datetime(year, month + 1, 1, 0, 0, 0)
            
            # Count applicants joined in this date range
            count = 0
            for applicant in all_applicants:
                if applicant.joined_at and start_date <= applicant.joined_at < end_date:
                    count += 1
            
            
            # No sample data - using only real data from database
            
            # Store count in proper order (current month at its actual position in the year)
            month_index = month - 1  # Convert 1-based month to 0-based index (Jan=0, Feb=1, etc)
            monthly_counts[month_index] = count
        
        return {"monthly_data": monthly_counts}
        
    except Exception as e:
        print(f"Error getting monthly applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting monthly applications: {str(e)}")


@router.get("/get_monthly_users", response_model=MonthlyData)
async def get_monthly_users():
    try:
        # Get the current month and year
        current_date = datetime.now()
        
        # Initialize counts list (one entry per month for the last 12 months)
        monthly_counts = [0] * 12
        
        # Get all users - we'll process them in memory for more reliable results
        all_users = await User.find_all().to_list()
        print(f"Total users found: {len(all_users)}")
        
        # For each of the past 12 months, count users verified in that month
        for i in range(12):
            # Calculate the month we're looking at (current month - i)
            month = (current_date.month - i - 1) % 12 + 1
            year = current_date.year if current_date.month > i else current_date.year - 1
            
            # Set start date to first day of month at 00:00:00
            start_date = datetime(year, month, 1, 0, 0, 0)
            
            # Set end date to first day of next month at 00:00:00
            if month == 12:
                end_date = datetime(year + 1, 1, 1, 0, 0, 0)
            else:
                end_date = datetime(year, month + 1, 1, 0, 0, 0)
            
            # Count users verified in this date range
            count = 0
            for user in all_users:
                if hasattr(user, 'verified_at') and user.verified_at and start_date <= user.verified_at < end_date:
                    count += 1
                    
            # Debug information
            print(f"Month {month}/{year}: {count} verified users")
            
            # No sample data - using only real data from database
            
            # Store count in proper order (current month at its actual position in the year)
            month_index = month - 1  # Convert 1-based month to 0-based index (Jan=0, Feb=1, etc)
            monthly_counts[month_index] = count
        
        return {"monthly_data": monthly_counts}
        
    except Exception as e:
        print(f"Error getting monthly users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting monthly users: {str(e)}")



