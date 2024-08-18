from typing import Optional, Union

from fastapi import Request, FastAPI, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, init_db
import schemas, controllers
from fastapi.security import OAuth2PasswordRequestForm
import models

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.middleware("http")
async def authenticate_session(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    if session_id:
        with next(get_db()) as db:
            session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
            if session and session.is_active():
                request.state.user = session.user
            else:
                request.state.user = None
    else:
        request.state.user = None

    response = await call_next(request)
    return response

@app.get("/auth-check")
def auth_check(request: Request):
    if request.state.user is None:
        return {"logged_in": False}
    
    user = request.state.user
    return {
        "logged_in": True,
        "username": user.username,
        "role": user.role
    }

@app.post("/users/", response_model=schemas.UserCreate)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = controllers.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return controllers.create_user(db=db, user=user)

@app.post("/projects/", response_model=schemas.ProjectCreate)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    existing_project = db.query(models.Project).filter(models.Project.name == project.name).first()
    if existing_project:
        return JSONResponse(content={"duplicate_project": True})
        
    return controllers.create_project(db=db, project=project)

@app.get("/projects/")
def read_projects(db: Session = Depends(get_db)):
    return controllers.get_projects(db=db)


@app.post("/testcases/", response_model=schemas.TestCaseCreate)
def create_test_case(test_case: schemas.TestCaseCreate, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if session_id:
        with next(get_db()) as db:
            session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
            if session and session.is_active():
                return controllers.create_test_case(db=db, test_case=test_case, user_id=session.user.id)

    return JSONResponse(content={"message": "Authentication Failed, Action Not Allowed"})

@app.get("/testcases/")
def read_test_cases(request: Request, skip: int = 0, limit: int = 10, search: Optional[str] = Query(None), db: Session = Depends(get_db)):

    session_id = request.cookies.get("session_id")
    if session_id:        
        session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
        if session and session.is_active():
            return controllers.get_test_cases(skip=skip, limit=limit, search=search, db=db, user=session.user)

    raise HTTPException(status_code=401, detail="Authentication Failed")

@app.put("/testcases/", response_model=schemas.TestCaseUpdate)
def update_test_case(test_case: schemas.TestCaseUpdate, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if session_id:        
        session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
        if session and session.is_active():
            return controllers.update_test_case(db=db, test_case=test_case, user=session.user)
    
    raise HTTPException(status_code=401, detail="Authentication Failed")    

@app.delete("/testcases/{test_case_id}", response_model=schemas.TestCaseCreate)
def delete_test_case(test_case_id: int, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if session_id:        
        session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
        if session and session.is_active():
            return controllers.delete_test_case(db=db, test_case_id=test_case_id, user=session.user)
    
    raise HTTPException(status_code=401, detail="Authentication Failed")    

@app.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return controllers.verify_login_details(db=db, username=form_data.username, password=form_data.password)

@app.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    db.query(models.Session).filter(models.Session.session_id == session_id).delete()
    db.commit()

    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("session_id")
    return response