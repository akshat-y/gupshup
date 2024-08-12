from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str

class ProjectBase(BaseModel):
    name: str
    jira_ticket_id: str

class ProjectCreate(ProjectBase):
    pass

class TestCaseBase(BaseModel):
    project_id: int
    test_case_name: str
    type: str
    description: str
    input_data: str
    expected_result: str
    actual_result: str
    status: str

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseUpdate(TestCaseBase):
    pass
