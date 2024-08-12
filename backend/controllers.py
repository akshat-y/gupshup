from sqlalchemy.orm import Session
import models
from schemas import UserCreate, ProjectCreate, TestCaseCreate, TestCaseUpdate
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import bcrypt
from datetime import datetime, timedelta, timezone
import uuid

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: UserCreate):
    password_hash = hash_password(user.password)
    db_user = models.User(username=user.username, password_hash=password_hash, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_project(db: Session, project: ProjectCreate):
    db_project = models.Project(name=project.name, jira_ticket_id=project.jira_ticket_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_test_case(db: Session, test_case: TestCaseCreate, user_id: int):
    db_test_case = models.TestCase(
        project_id=test_case.project_id,
        user_id=user_id,
        test_case_name=test_case.test_case_name,
        type=test_case.type,
        description=test_case.description,
        input_data=test_case.input_data,
        expected_result=test_case.expected_result,
        actual_result=test_case.actual_result,
        status=test_case.status
    )
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

def get_test_cases(db: Session, user_id: int = None):
    if user_id:
        return db.query(models.TestCase).filter(models.TestCase.user_id == user_id).all()
    return db.query(models.TestCase).all()

def update_test_case(db: Session, test_case_id: int, test_case: TestCaseUpdate):
    db_test_case = db.query(models.TestCase).filter(models.TestCase.id == test_case_id).first()
    if db_test_case:
        db_test_case.test_case_name = test_case.test_case_name
        db_test_case.type = test_case.type
        db_test_case.description = test_case.description
        db_test_case.input_data = test_case.input_data
        db_test_case.expected_result = test_case.expected_result
        db_test_case.actual_result = test_case.actual_result
        db_test_case.status = test_case.status
        db.commit()
        db.refresh(db_test_case)
    return db_test_case

def delete_test_case(db: Session, test_case_id: int):
    db_test_case = db.query(models.TestCase).filter(models.TestCase.id == test_case_id).first()
    if db_test_case:
        db.delete(db_test_case)
        db.commit()
    return db_test_case

def verify_login_details(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    expires_at = datetime.now(timezone.utc) + timedelta(days=1)
    
    # Create a session here (simple example using a cookie)
    session_id = str(uuid.uuid4())
    new_session = models.Session(session_id=session_id, user_id=user.id, expires_at=expires_at)
    db.add(new_session)
    db.commit()

    
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="session_id", 
        value=session_id,
        secure=True,
        samesite="None",
        expires=expires_at
    )
    return response