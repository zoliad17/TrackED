from enum import Enum
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import distinct, func
from typing import List
from routes.auth import isAuthorized
import model
import uuid
from database import db_dependency
from typing import Optional


admin_router = APIRouter(prefix="/admin", tags=['admin'])

#Section Enum
class SectionEnum(str,Enum):
    A = 'A'
    B = 'B'
    C = 'C'

# Student Model
class student(BaseModel):
    student_name: str
    student_class: str
    registered: bool

# Class Course Model
class class_course(BaseModel):
    course_name: str
    course_code: str
    program_id: str
    units: int
    course_detail: str
    class_status:  bool

# Subject Model
class subject(BaseModel):
    subject_name: str
    subject_code: str
    subject_status: bool

class CourseAttend(BaseModel):
    course_id: str
    student_id: str

class CreateProgram(BaseModel):
    program_name: str 
    program_details: str
    req_credits: int

# Token Model
class Token(BaseModel):
    access_token: str
    token_type: str

class CreateSection(BaseModel):
    section_name: SectionEnum
    year_level: int
    program_id: str
    current_student: int
    schedule: str

#Filter Section By Program Model
class SectionBase(BaseModel):
    section_id: str
    section_name: str
    program_id: str
    year_level: int
    current_student: int
    schedule: str

    class Config:
        orm_mode = True

#Update Section Model
class SectionUpdate(BaseModel):
    section_name: Optional[str] 
    year_level: Optional[int]
    program_id: Optional[str] 
    current_student: Optional[int]
    schedule: Optional[str] 


class EditCourse(BaseModel):
    course_name: str
    course_code: str
    program_id: str
    units: int
    course_detail: str

# Enum for student status
class StudentStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    GRADUATED = "Graduated"
    SUSPENDED = "Suspended"
    EXPELLED = "Expelled"

# Pydantic model for student update
class StudentUpdate(BaseModel):
    program_id: Optional[str] = None
    section_id: Optional[str] = None
    current_gpa: Optional[float] = None
    gpax: Optional[float] = None
    credits: Optional[float] = None
    year_level: Optional[int] = None
    number_course: Optional[int] = None
    student_status: Optional[StudentStatus] = None


#Get all Student from Admin Dashboard Student List
@admin_router.get("/get_all/stats", status_code=status.HTTP_200_OK)
async def get_all_stats(db: db_dependency):
    total_students = db.query(model.Student).count()
    total_teachers = db.query(model.Teacher).count()
    total_courses = db.query(model.Course).count()
    total_sections = db.query(model.Section).count()

    return {"Total Students": total_students, "Total Teachers": total_teachers, "Total Courses": total_courses, "Total Sections": total_sections}

#AttendCourse
@admin_router.post("/student/attendcourse", status_code=status.HTTP_201_CREATED)
async def course_attended(course_attend: CourseAttend, role: Annotated[str, Depends(isAuthorized)], db: db_dependency ):
    if role != "admin": 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to do this action!")
    course_id = course_attend.course_id
    student_id = course_attend.student_id

    get_courseId = db.query(model.Course).filter(model.Course.course_id == course_id).first()
    get_studentId = db.query(model.Student).filter(model.Student.student_id == student_id).first()

    if get_courseId is None: 
        raise HTTPException(status_code=404, detail="This course does not exist!") 
    
    if get_studentId is None: 
        raise HTTPException(status_code=404, detail="There student does not exist") 
    
    student_attended_course = db.query(model.CourseAttend).filter(model.CourseAttend.student_id == student_id)
    if student_attended_course is not None: 
        raise HTTPException(status_code=403, detail="Student is already in this course")

    course_attend = model.CourseAttend(
        course_id = course_id,
        student_id = student_id,
        midterm_grade = 0,
        final_grade =0,
        total_grade=0,
        gpa=0,
    )

    db.add(course_attend)
    db.commit()

    return {"message": "Course attended successfully!"}


#CRUD Program
#--------------------------------
@admin_router.post("/program/create", status_code=status.HTTP_201_CREATED)
async def create_department(program: CreateProgram, db: db_dependency):
    # if role != "admin": 
    #     raise HTTPException(status_code=403, detail="You are not authorized to do this action")

    program_id = str(uuid.uuid4())
    program_name = program.program_name
    program_details = program.program_details
    req_credits = program.req_credits

    new_program = model.Program(
        program_id=program_id,
        program_name=program_name,
        program_details=program_details,
        req_credits=req_credits
    )

    db.add(new_program)
    db.commit()

    return {"message": "Successfully created program"}


#Get All program
@admin_router.get("/get_all_program", status_code=status.HTTP_200_OK)
async def get_all_program(db: db_dependency):
    get_all_programs = db.query(model.Program).all()

    return {"programs": get_all_programs}


    
#CRUD Course 
#----------------------------------------------------
@admin_router.post("/create/course", status_code=status.HTTP_201_CREATED)
async def create_course(course: class_course,db: db_dependency):

    # if role != "admin" or role != "teacher":
    #     raise HTTPException(status_code=403, detail="You are not authorized to do this action!")
    course_id = str(uuid.uuid4())   
    course_status = True
    
    db_course = model.Course(
        course_id = course_id,
        course_code = course.course_code,
        course_name = course.course_name,
        program_id = course.program_id,
        units = course.units,
        course_detail = course.course_detail,
        course_status = course_status
    )

    db.add(db_course)
    db.commit()

    return {"message": "Created course successfully"}


#Get Course
@admin_router.get("/course/{course_id}", status_code=status.HTTP_200_OK)
async def fetch_course(course_id: str,role: Annotated[str, Depends(isAuthorized)], db: db_dependency):
    
    if role != "admin": 
        raise HTTPException(status_code=403, detail="You are not authorized to do this action!")

    get_course = db.query(model.Course).filter(model.Course.course_id == course_id).first()
    if get_course == None:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"course": get_course}


# @admin_router.get("/course", status_code=status.HTTP_200_OK)
# async def getall_course(db: db_dependency):
#     getall_results = db.query(model.Course, model.Program).join(model.Program, model.Course.program_id == model.Program.program_id).group_by(model.Course.course_id)

#     new_results = db.execute(getall_results).mappings().all()

#     return {"courses": new_results} 

#Getting All Course for the Course View Admin
@admin_router.get("/get_all_course", status_code=status.HTTP_200_OK)
async def get_all_course(db: db_dependency):

    get_all_courses = db.query(
        model.Course.course_id,
        model.Course.course_code,
        model.Course.course_name,
        model.Course.units,
        model.Course.program_id,
        model.Course.course_detail
    ).all()

    courses = []
    for course in get_all_courses:
        program = db.query(model.Program.program_name).filter(model.Program.program_id == course.program_id).first()
        
        courses.append({
            "course_id": course.course_id,
            "course_code": course.course_code,
            "course_name": course.course_name,
            "units": course.units,
            "program_name": program.program_name if program else None,
            "program_id": course.program_id,
            "course_detail": course.course_detail
        })

    return {"courses": courses}

#Update Course
@admin_router.put("/course/{course_id}", status_code=status.HTTP_202_ACCEPTED)
async def edit_course(course_id: str, course_edit: EditCourse, db:db_dependency):
    get_course = db.query(model.Course).filter(model.Course.course_id == course_id)
    if get_course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no such course!")
    edit = {         
        "course_name": course_edit.course_name,
        "course_code": course_edit.course_code,
        "program_id": course_edit.program_id,
        "units": course_edit.units,
        "course_detail": course_edit.course_detail,
    }   

    get_course.update(edit)
    db.commit()

    return {"message": "Updated course has been updated!"}
    

#Delete Course
@admin_router.delete("/course/{course_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_course(course_id: str, db:db_dependency):
    get_course = db.query(model.Course).filter(model.Course.course_id == course_id) 
    if get_course is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no such course!")
    
    get_course.delete()
    db.commit()


#CRUD Section
#---------------------------------------------------------
#Create Section
@admin_router.post("/section/create", status_code=status.HTTP_201_CREATED)
async def create_section(section: CreateSection, db: db_dependency):
    # Validate program_id
    program_exists = db.query(model.Program).filter_by(program_id=section.program_id).first()
    if not program_exists:
        raise HTTPException(
            status_code=400,
            detail=f"Program with ID {section.program_id} does not exist.",
        )

    section_id = str(uuid.uuid4())  # Generate a unique section ID

    # Create a new section object without section_status
    db_section = model.Section(
        section_id=section_id,
        section_name=section.section_name,
        year_level=section.year_level,
        program_id=section.program_id,
        current_student=section.current_student,
        schedule=section.schedule,
    )

    db.add(db_section)
    db.commit()

    return {"message": "Section created successfully", "section_id": section_id}


    
#Get Section
@admin_router.get("/get_all_section", status_code=status.HTTP_200_OK)
async def get_all_section(db: db_dependency):
    get_all_sections = db.query(model.Section).all()

    return{"sections": get_all_sections}

#Get Section Value in add student form
@admin_router.get("/get_section_student_form", status_code=status.HTTP_200_OK)
async def get_all_section(db: db_dependency):
    get_all_sections = db.query(model.Section).all()
    return {
        "sections": [{"section_id": section.id, "section_name": section.name} for section in get_all_sections]
    }


# # Filtered Sections by program
# @admin_router.get("/admin/get_filtered_sections_by_program")
# async def get_filtered_sections_by_program(
#     program_name: str = Query(..., min_length=1),  # Ensure query parameter validation
#     db: Session = Depends(db_dependency)
# ):
#     try:
#         # Verify program exists
#         program = db.query(model.Program).filter(model.Program.program_name.ilike(program_name)).first()
#         if not program:
#             raise HTTPException(status_code=404, detail="Program not found")

#         # Fetch sections associated with the program
#         sections = db.query(model.Section).filter(model.Section.program_id == program.program_id).all()
        
#         # Return section data
#         return [{"section_id": section.section_id, "section_name": section.section_name} for section in sections]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



#Update Section
@admin_router.put("/section/{section_id}", status_code=status.HTTP_202_ACCEPTED)
async def update_section(section_id: str, section_edit: SectionUpdate, db: db_dependency):
    # Query the section to see if it exists
    get_section = db.query(model.Section).filter(model.Section.section_id == section_id).first()
    
    if get_section is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    
    # Debugging: Log the incoming values for update
    print(f"Attempting to update section {section_id} with data: {section_edit.dict()}")

    # Update only the fields that have a value
    if section_edit.section_name is not None:
        get_section.section_name = section_edit.section_name
    if section_edit.year_level is not None:
        get_section.year_level = section_edit.year_level
    if section_edit.program_id is not None:
        get_section.program_id = section_edit.program_id
    if section_edit.current_student is not None:
        get_section.current_student = section_edit.current_student
    if section_edit.schedule is not None:
        get_section.schedule = section_edit.schedule

    # Commit changes to the database
    db.commit()

    # Debugging: Check if the section was updated
    print(f"Section after update: {get_section}")

    return {"message": "Section has been updated successfully!"}


#delete section
@admin_router.delete("/section/{section_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_section(section_id: str, db: db_dependency):
    get_section = db.query(model.Section).filter(model.Section.section_id == section_id).first()

    if get_section is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    
    db.delete(get_section)
    db.commit()
        

#CRUD STUDENT

#Get Student
@admin_router.get("/get_all_student", status_code=status.HTTP_200_OK)
async def get_all_student(db: db_dependency):
    try:
        # Fetch all students with their related data in a single query
        get_all_students = db.query(
            model.Student.student_id,
            model.Student.year_level,
            model.Student.student_status,
            model.Student.current_gpa,
            model.Student.gpax,
            model.Student.number_course,
            model.User.firstname,
            model.User.lastname,
            model.User.username,
            model.Program.program_name,
            model.Section.section_name
        ).join(
            model.User, 
            model.Student.user_id == model.User.user_id
        ).join(
            model.Program, 
            model.Student.program_id == model.Program.program_id
        ).join(
            model.Section, 
            model.Student.section_id == model.Section.section_id
        ).all()

        students = []
        for student in get_all_students:
            students.append({
                "student_id": student.student_id,
                "name": f"{student.firstname} {student.lastname}",
                "program": student.program_name,
                "year_level": student.year_level,
                "section": student.section_name,
                "email": student.username,
                "current_gpa": student.current_gpa,
                "gpax": student.gpax,
                "number_course": student.number_course,
                "status": student.student_status
            })

        return {
            "status": "success",
            "message": "Students retrieved successfully",
            "total_students": len(students),
            "students": students
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving students: {str(e)}"
        )

#Update Student
@admin_router.put("/update_student/{student_id}", status_code=status.HTTP_200_OK)
async def update_student(student_id: int, student_data: dict, db: db_dependency):
    try:
        # Find the student and related user
        student = db.query(model.Student).filter(model.Student.student_id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        user = db.query(model.User).filter(model.User.user_id == student.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the User table with firstname, lastname, and email
        user.firstname = student_data.get("firstname", user.firstname)
        user.lastname = student_data.get("lastname", user.lastname)
        user.username = student_data.get("email", user.username)

        # Update the Student table
        student.program_id = student_data.get("program_id", student.program_id)
        student.year_level = student_data.get("year_level", student.year_level)
        student.section_id = student_data.get("section_id", student.section_id)
        student.current_gpa = student_data.get("current_gpa", student.current_gpa)

        db.commit()

        return {"status": "success", "message": "Student updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

#Delete Student
@admin_router.delete("/delete_student/{student_id}", status_code=status.HTTP_200_OK)
async def delete_student(student_id: str, db: db_dependency):
    try:
        # Check if student exists
        student = db.query(model.Student).filter(model.Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student with ID {student_id} not found"
            )

        # Get user_id before deleting student
        user_id = student.user_id

        # Delete student record
        db.delete(student)

        # Delete associated user record
        user = db.query(model.User).filter(model.User.user_id == user_id).first()
        if user:
            db.delete(user)

        db.commit()

        return {
            "message": "Student and associated user account deleted successfully",
            "deleted_student_id": student_id
        }

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting student: {str(e)}"
        )
    

#CRUD TEACHER

#Get Teacher
@admin_router.get("/get_all_teacher", status_code=status.HTTP_200_OK)
async def get_all_teacher(db: db_dependency):
    try:
        # Fetch all teachers with their related data in a single query
        get_all_teachers = db.query(
            model.Teacher.teacher_id,
            model.User.firstname,
            model.User.lastname,
            model.User.username,
            model.Program.program_name
        ).join(
            model.User, 
            model.Teacher.user_id == model.User.user_id  # Join User based on user_id
        ).join(
            model.Program, 
            model.Teacher.program_id == model.Program.program_id  # Join Program based on program_id
        ).all()

        teachers = []
        for teacher in get_all_teachers:
            teachers.append({
                "teacher_id": teacher.teacher_id,
                "name": f"{teacher.firstname} {teacher.lastname}",
                "program": teacher.program_name if teacher.program_name else "No Program Assigned",
                "email": teacher.username
            })

        return {
            "status": "success",
            "message": "Teachers retrieved successfully",
            "total_teachers": len(teachers),
            "teachers": teachers
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving teachers: {str(e)}"
        )


#Update Teacher
@admin_router.put("/update_teacher/{teacher_id}", status_code=status.HTTP_200_OK)
async def update_teacher(teacher_id: int, teacher_data: dict, db: db_dependency):
    try:
        # Fetch the teacher and associated user
        teacher = db.query(model.Teacher).filter(model.Teacher.teacher_id == teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        user = db.query(model.User).filter(model.User.user_id == teacher.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user details
        if "firstname" in teacher_data:
            user.firstname = teacher_data["firstname"]
        if "lastname" in teacher_data:
            user.lastname = teacher_data["lastname"]
        if "email" in teacher_data:
            user.username = teacher_data["email"]
        
        # Update teacher details
        if "program_id" in teacher_data:
            teacher.program_id = teacher_data["program_id"]
        
        db.commit()
        return {"status": "success", "message": "Teacher updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating teacher: {str(e)}"
        )

#delete Teacher
@admin_router.delete("/delete_teacher/{teacher_id}", status_code=status.HTTP_200_OK)
async def delete_teacher(teacher_id: str, db: db_dependency):  # Accept teacher_id as a string
    try:
        # Fetch the teacher
        teacher = db.query(model.Teacher).filter(model.Teacher.teacher_id == teacher_id).first()
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Teacher with ID {teacher_id} not found"
            )
        
        user_id = teacher.user_id

        # Delete teacher and user
        db.delete(teacher)
        user = db.query(model.User).filter(model.User.user_id == user_id).first()
        if user:
            db.delete(user)
        
        db.commit()
        return {
            "message": "Teacher and associated user account deleted successfully",
            "deleted_teacher_id": teacher_id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting teacher: {str(e)}"
        )






    






