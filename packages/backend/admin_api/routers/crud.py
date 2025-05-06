from fastapi import APIRouter, HTTPException
from admin_api.models.documents import Admin, AdminCreate, LoginRequest, TotalUsers, User, Job, TotalJobs
from admin_api.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token

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

