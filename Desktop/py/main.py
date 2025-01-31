from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert,text
from database import engine
import model
from passlib.context import CryptContext
from routes import auth, user, attendance,admin
import uuid
import uvicorn

app = FastAPI()

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)
model.Base.metadata.create_all(bind=engine)

app.include_router(user.user_router)
app.include_router(auth.auth_router)
app.include_router(attendance.attendance_router)
app.include_router(admin.admin_router)



bcrpyt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

with engine.connect() as conn:
    stmt = text("select * from admin")
    
    user_id = str(uuid.uuid4())
    password=bcrpyt_context.hash("admin123")

    listAdmin = conn.execute(stmt).fetchall()
    if len(listAdmin) == 0:
        conn.execute(insert(model.User),[{
            "user_id":user_id,
            "firstname":"admin",
            "lastname":"admin",
            "role":"admin",
            "username":"admin@example.com",
            "password":password
        }])

        conn.execute(insert(model.Admin),[{
            "admin_id":user_id,
            "user_id":user_id
        }])

        conn.commit()



if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)