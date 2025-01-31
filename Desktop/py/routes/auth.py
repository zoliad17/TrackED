from datetime import datetime, timedelta
from enum import Enum
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from starlette import status
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import model
from database import db_dependency

auth_router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
ALGORITHM = 'HS256'

bcrpyt_context = CryptContext(schemes=['bcrypt'])
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

# Role ENUM
class RoleType(str, Enum):
    admin = 'admin'
    teacher = 'teacher'
    student = 'student'

#login Model
class Login(BaseModel): 
    username: str
    password: str

#Authentication
#-------------------------------------
@auth_router.post("/login", status_code=status.HTTP_202_ACCEPTED)
async def login_for_access_token(form_data: Login, db:db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could Not Validate User')
    
    token = create_access_token(user.username, user.user_id, user.role, timedelta(minutes=2000))
    return{"access_token": token, "token_type": "bearer"}

#Authenticate User
def authenticate_user(username: str, password: str, db):
    user = db.query(model.User).filter(model.User.username == username).first()
    if not user: 
        return False
    if not bcrpyt_context.verify(password, user.password):
        return False
    return user

#Create Access Token
def create_access_token(username: str, user_id: int, role: RoleType, expires_delta: timedelta):
    expires = datetime.now() + expires_delta
    expires = int(expires.timestamp())
    encode = {'sub': username, 'id': user_id, 'roleType': role, 'exp': expires}
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

#Check user authentication after token expires
#-------------------------------------
@auth_router.get("/verif", status_code=status.HTTP_202_ACCEPTED)
async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception 
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User is not valid or token has expired')

    return {"message": "User is still authenticated", "auth": True}

#Protected Route for Backend
#-------------------------------------
def isAuthorized(token: Annotated[str, Depends(oauth2_bearer)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = None
        if int(datetime.now().timestamp()) > payload.get("exp"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are no longer authenticated")

        username: str = payload.get("roleType")
        if username is None:
            raise credentials_exception   

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User is not valid or token has expired')

    return username
