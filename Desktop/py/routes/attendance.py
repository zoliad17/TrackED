from enum import Enum
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from routes.auth import isAuthorized
import base64
import io
import qrcode
from datetime import datetime
import model
import uuid
from database import db_dependency

attendance_router = APIRouter(prefix="/qr", tags=['attendance'])

class CreateAttendance(BaseModel):
    course_id: str
    time_end: datetime

# Student Attendance Model
class student_attendance(BaseModel):
    attendance_id: str
    student_id: str
    qr_pass: str

@attendance_router.get("/attendance_time/{attendance_id}/", status_code=status.HTTP_200_OK)
async def get_qr_time(attendance_id: str, db: db_dependency):
    attendance = db.query(model.Attendance).filter(model.Attendance.attendance_id == attendance_id).first()
    if attendance == None: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This attendance does not exist!") 
    
    if datetime.now() > attendance.time_end:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Time has already passed!")
    
    duration = attendance.time_end - datetime.now()
    time_split = str(duration).split(":")
    hour = int(time_split[0])*3600
    minutes = int(time_split[1])*60
    seconds = time_split[2].split(".")
    seconds = int(seconds[0])

    print(duration)

    total_time = hour+minutes+seconds 
    
    return {"message": total_time}

@attendance_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_qr(attendance:CreateAttendance,db: db_dependency): 

    attendance_id = str(uuid.uuid4())
    qr_name = str(uuid.uuid4())
    course_id = attendance.course_id
    time_end = attendance.time_end

    attended_students = db.query(model.CourseAttend).filter(model.CourseAttend.course_id == course_id).all()

    for i in attended_students:
      new_students_list =  model.StudentAttendance(  
        studentattendance_id = str(uuid.uuid4),
        attendance_id = attendance_id,
        student_id = i.student_id,
        status = "Absent",
        time_scanned = datetime.now()
        )
      db.add(new_students_list)
      db.commit()
      
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    qr.add_data(qr_name)
    qr.make(fit=True)

    # Create the QR image in memory
    img = qr.make_image(fill_color="black", back_color="white")
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    buffer = base64.b64encode(img_io.read()).decode('utf-8')
    qr_png = f'data:image/png;base64,{buffer}'

    current_time = datetime.now()

    if current_time > attendance.time_end:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Time end does not exist!")
    
    db_attendance = model.Attendance(
        attendance_id = attendance_id,
        qr_png = qr_png,
        qr_name=qr_name,
        course_id=course_id,
        time_start= current_time, 
        time_end= time_end,
        attendance_status=True,
    )

    db.add(db_attendance) 
    db.commit()

    return {"message": "Created qr successfully!"}

@attendance_router.get('/get_qr/{attendance_id}', status_code=status.HTTP_200_OK)
async def fetch_qr(attendance_id:str,db:db_dependency):
    
    get_qr = db.query(model.Attendance).filter(model.Attendance.attendance_id == attendance_id).first()
    if get_qr == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR code not found")

    return {"qr": get_qr}

@attendance_router.post('/scan_qr', status_code=status.HTTP_202_ACCEPTED)
async def scan_qr(student_attendance:student_attendance,db: db_dependency):

    get_qr = db.query(model.Attendance).filter(model.Attendance.attendance_id == student_attendance.attendance_id).first()

    if get_qr is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no such attendance in that id")
    
    get_student = db.query(model.StudentAttendance).filter(model.StudentAttendance == student_attendance.student_id).first()

    if get_student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no student with this id")

    if datetime.now() > get_qr.time_end > get_qr.time_end + datetime.time(0, 30, 0): 
        attend_student = model.StudentAttendance(
            studentattendance_id = str(uuid.uuid4()),
            attendance_id=student_attendance.attendance_id,
            student_id=student_attendance.student_id,
            status="Late",
            time_scanned=datetime.now()
        ) 

        db.add(attend_student)
        db.commit()
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Scanned Failed, time already passed!")

    attend_student = model.StudentAttendance(
        studentattendance_id = str(uuid.uuid4()),
        attendance_id=student_attendance.attendance_id,
        student_id=student_attendance.student_id,
        status="Present",
        time_scanned=datetime.now()
    )

    db.add(attend_student)
    db.commit()
    
    return {'message': 'Scanned Successfully'}
