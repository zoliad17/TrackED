from enum import Enum
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime 
import model
from routes.auth import isAuthorized
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import uuid
from database import db_dependency

user_router = APIRouter(prefix="/create/user", tags=['user'])

SECRET_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
ALGORITHM = 'HS256'

bcrpyt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

# Role ENUM
class RoleType(str, Enum):
    admin = 'admin'
    teacher = 'teacher'
    student = 'student'

# Create User Admin
class CreateUserAdmin(BaseModel):
    first_name: str
    last_name: str
    role: RoleType
    username: str
    password: str

#Create Student Teacher ACC
class CreateStudent(BaseModel):
    first_name: str
    last_name: str
    role:RoleType
    year_level: int
    section_id: str
    program_id: str
    username: str
    password: str

class CreateTeacher(BaseModel):
    first_name: str
    last_name: str
    role:RoleType
    program_id: str
    username: str
    password: str



#CRUD Student
@user_router.post("/student", status_code=status.HTTP_201_CREATED)
async def create_user_student(create_student:CreateStudent,db: db_dependency):

    user_id = str(uuid.uuid4())
    program_id = create_student.program_id
    password=bcrpyt_context.hash(create_student.password)

    if program_id is None:
        raise HTTPException(status_code=404, detail="There is no student with this id")

    # Create common user record
    create_user_model = model.User(
        user_id=user_id,
        firstname=create_student.first_name,
        lastname=create_student.last_name,
        role=create_student.role,
        username=create_student.username,
        password=password
    )

    # Add the common user to the User table
    db.add(create_user_model)
    db.commit()

    # Custom Student ID
    def get_last_id_student():
        qry = db.query(model.Student).order_by(model.Student.student_id.desc()).first()
        
        if qry is None:
            # If no students are present, start with the current year/month followed by "001"
            ym = datetime.now().strftime("%y%m")
            q_custom_id = ym + "001"
            return q_custom_id
        else:
            # Extract the year/month part and increment the numerical part
            last_student_id = qry.student_id
            ym = datetime.now().strftime("%y%m")
            
            # Ensure the student_id starts with the correct year/month prefix
            if last_student_id[:4] == ym:
                # Increment the numerical part
                numerical_part = int(last_student_id[4:]) + 1
            else:
                # If the year/month changed, reset the numerical part to 1
                numerical_part = 1
            
            # Format the new ID with leading zeros for the numerical part
            q_custom_id = ym + str(numerical_part).zfill(3)
            return q_custom_id
    
    # Add user to corresponding role-based table
    if create_student.role == RoleType.student  :
        student = model.Student(
            student_id= get_last_id_student(), #Output example: 2501001++
            user_id=user_id,
            program_id=program_id,
            section_id=create_student.section_id,
            current_gpa=0.0,
            gpax=0.0,
            year_level= create_student.year_level,
            number_course=0,
            student_status="Active"  # Default status
        )
        db.add(student)
        db.commit()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    
    return {"message": "Successfully created a user"}


#Create User/Teacher
@user_router.post("/teacher", status_code=status.HTTP_201_CREATED)
async def create_user_teacher(create_teacher: CreateTeacher,db: db_dependency):  

    user_id = str(uuid.uuid4())
    password = bcrpyt_context.hash(create_teacher.password)

    create_user_request = model.User(
    user_id=user_id,
    firstname=create_teacher.first_name,
    lastname=create_teacher.last_name,
    role=create_teacher.role,
    username=create_teacher.username,
    password=password
    )

    db.add(create_user_request)
    db.commit()

    #Custom Teacher ID
    def get_last_id_teacher():
        qry = db.query(model.Teacher).order_by(model.Teacher.teacher_id.desc()).first()

        if qry is None:
            # If no teacher records exist, start with the current year/month followed by "-0100"
            ym = datetime.now().strftime("%Y")  # Use full year for output like "2025"
            q_custom_id = f"{ym}-0100"
            return q_custom_id
        else:
            # Extract the last teacher ID
            last_teacher_id = qry.teacher_id
            ym = datetime.now().strftime("%Y")  # Ensure to use the current year

            # Ensure the teacher ID starts with the correct year prefix
            if last_teacher_id[:4] == ym:
                # Increment the numerical part
                numerical_part = int(last_teacher_id[5:]) + 1
            else:
                # If the year changed, reset the numerical part to 100
                numerical_part = 100
            
            # Format the new ID with the correct year and leading zeros for the numerical part
            q_custom_id = f"{ym}-{str(numerical_part).zfill(4)}"
            return q_custom_id  

    if create_user_request.role == RoleType.teacher:
        teacher = model.Teacher(
            teacher_id=get_last_id_teacher(),
            program_id=create_teacher.program_id,
            user_id=user_id,
            num_course_owned=0,
        )
        db.add(teacher)
        db.commit()

    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    
    return {"message": "Successfully created a user"}


#Create User/Admin
@user_router.post("/admin", status_code=status.HTTP_201_CREATED)
async def create_user_admin(create_user_admin: CreateUserAdmin,role: Annotated[str, Depends(isAuthorized)], db: db_dependency):
    if role != "admin": 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to do this action!")

    user_id = str(uuid.uuid4())
    roleAdmin = RoleType.admin
    password=bcrpyt_context.hash(create_user_admin.password)

    new_admin= model.User(
        user_id=user_id,
        firstname=create_user_admin.first_name,
        lastname=create_user_admin.last_name,
        role=roleAdmin,
        username=create_user_admin.username,
        password=password
    )
    db.add(new_admin)
    db.commit()

    if create_user_admin.role == RoleType.admin:
        admin = model.Admin(
            admin_id=user_id,
            user_id=user_id
        )
        db.add(admin)
        db.commit()

    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
