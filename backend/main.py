from typing import Optional, Union

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, init_db
import schemas, controllers
from fastapi.security import OAuth2PasswordRequestForm

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

@app.post("/users/", response_model=schemas.UserCreate)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = controllers.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return controllers.create_user(db=db, user=user)

@app.post("/projects/", response_model=schemas.ProjectCreate)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return controllers.create_project(db=db, project=project)

@app.post("/testcases/", response_model=schemas.TestCaseCreate)
def create_test_case(test_case: schemas.TestCaseCreate, db: Session = Depends(get_db), user_id: int = 1):
    return controllers.create_test_case(db=db, test_case=test_case, user_id=user_id)

@app.get("/testcases/")
def read_test_cases(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return controllers.get_test_cases(db=db, user_id=user_id)

@app.put("/testcases/{test_case_id}", response_model=schemas.TestCaseUpdate)
def update_test_case(test_case_id: int, test_case: schemas.TestCaseUpdate, db: Session = Depends(get_db)):
    return controllers.update_test_case(db=db, test_case_id=test_case_id, test_case=test_case)

@app.delete("/testcases/{test_case_id}", response_model=schemas.TestCaseCreate)
def delete_test_case(test_case_id: int, db: Session = Depends(get_db)):
    return controllers.delete_test_case(db=db, test_case_id=test_case_id)

@app.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return controllers.verify_login_details(db=db, username=form_data.username, password=form_data.password)