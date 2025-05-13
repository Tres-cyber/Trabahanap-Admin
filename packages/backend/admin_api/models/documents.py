from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from datetime import datetime
import enum




class Admin(Document):
   full_name: str
   email: EmailStr = Field(index=True, unique=True)
   password: str
   is_admin: bool = True
   createdAt: datetime = Field(default_factory=datetime.now)
   
   class Settings:
       name = "admins" 


class AdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    

class LoginRequest(BaseModel):
    email: EmailStr
    password: str   


class User(Document):
    first_name: str = Field(alias="firstName")
    middle_name: str | None = Field(default=None, alias="middleName")
    last_name: str = Field(alias="lastName")
    suffix_name: str | None = Field(default=None, alias="suffixName")
    gender: str
    birth_date: datetime = Field(alias="birthday")
    age: int
    email: EmailStr = Field(alias="emailAddress")
    password: str
    profile_picture: str | None = Field(default=None, alias="profileImage")
    barangay: str
    street: str
    house_number: str | None = Field(default=None, alias="houseNumber")
    user_type: str = Field(alias="userType")
    id_validation_front_image: str | None = Field(default=None, alias="idValidationFrontImage")
    id_validation_back_image: str | None = Field(default=None, alias="idValidationBackImage")
    id_type: str | None = Field(default=None, alias="idType")
    jobs_done: int = Field(default=0, alias="jobsDone")
    joined_at: datetime = Field(alias="joinedAt")
    verification_status: str = Field(alias="verificationStatus")
    verified_at: datetime | None = Field(default=datetime.now(), alias="verifiedAt")

    class Settings:
        name = "users"


class TotalUsers(BaseModel):
    total_users: int

class Job(Document):
    job_title: str = Field(alias="jobTitle")
    job_description: str = Field(alias="jobDescription")
    category: str
    job_location: str = Field(alias="jobLocation")
    job_status: str = Field(alias="jobStatus")
    budget: str
    job_duration: str = Field(alias="jobDuration")
    job_image: list[str] = Field(alias="jobImage")
    date_posted: datetime = Field(alias="datePosted")
    job_rating: int = Field(alias="jobRating")
    job_review: str = Field(alias="jobReview")
    accepted_at: datetime = Field(alias="acceptedAt")
    completed_at: datetime = Field(alias="completedAt")
    verified_at: datetime = Field(alias="verifiedAt")
    job_seeker_id: str = Field(alias="jobSeekerId")
    offer: str 

    class Settings:
        name = "jobrequest"


class TotalJobs(BaseModel):
    total_jobs: int


class Applicant(Document):
    first_name: str = Field(alias="firstName")
    middle_name: str | None = Field(default=None, alias="middleName")
    last_name: str = Field(alias="lastName")
    suffix_name: str | None = Field(default=None, alias="suffixName")
    gender: str
    birth_date: datetime = Field(alias="birthday")
    age: int
    email: EmailStr = Field(alias="emailAddress")
    password: str
    phone_number: str | None = Field(default=None, alias="phoneNumber")
    profile_picture: str | None = Field(default=None, alias="profileImage")
    bio: str | None = Field(default=None)
    barangay: str
    street: str
    house_number: str | None = Field(default=None, alias="houseNumber")
    user_type: str = Field(alias="userType")
    id_validation_front_image: str | None = Field(default=None, alias="idValidationFrontImage")
    id_validation_back_image: str | None = Field(default=None, alias="idValidationBackImage")
    id_type: str | None = Field(default=None, alias="idType")
    jobs_done: int = Field(default=0, alias="jobsDone")
    joined_at: datetime = Field(alias="joinedAt")
    verification_status: str = Field(alias="verificationStatus")
    

    class Settings:
        name = "applicants"


class TotalApplicants(BaseModel):
    total_applicants: int


class MonthlyData(BaseModel):
    monthly_data: list[int]


class JobTag(str, enum.Enum):
    PLUMBING = "plumbing"
    ELECTRICAL_REPAIRS = "electricalRepairs"
    CARPENTRY = "carpentry"
    ROOF_REPAIR = "roofRepair"
    PAINTING = "paintingServices"
    WELDING = "welding"
    GLASS_INSTALLATION = "glassInstallation"
    AIRCON_REPAIR = "airconRepairAndCleaning"
    APPLIANCE_REPAIR = "applianceRepair"
    PEST_CONTROL = "pestControlServices"
    AUTO_MECHANIC = "autoMechanic"
    CAR_WASH = "carWash"
    MOTORCYCLE_REPAIR = "motorcycleRepair"
    CAR_AIRCON = "carAirconRepair"
    WINDOW_TINTING = "windowTinting"
    CAREGIVER = "caregiver"
    PERSONAL_DRIVER = "personalDriver"
    MASSAGE = "massageTherapy"
    PET_GROOMING = "petGroomingAndPetCare"
    HOME_CLEANING = "homeCleaningServices"
    LAUNDRY = "laundryServices"
    GARDENING = "gardening"


class ApplicantJobSeeker(Document):
    _id: str | None = Field(default=None)
    applicantId: str | None = Field(default=None)
    joinedAt: datetime | None = Field(default=None)
    availability: bool = Field(default=True)
    hourlyRate: str = Field(default="0")
    credentials: str | None = Field(default=None)
    jobTags: list[str] = Field(default=[])
    
    class Settings:
        name = "applicant_jobseeker"


class JobSeeker(Document):
    user_id: str = Field(alias="userId")
    joined_at: datetime = Field(alias="joinedAt")
    availability: bool = Field(default=True)
    hourly_rate: str = Field(default="0", alias="hourlyRate")
    credentials: str | None = Field(default=None)
    rate: float | None = Field(default=None)
    job_tags: list[str] = Field(default=[], alias="jobTags")
    
    class Settings:
        name = "jobseekers"