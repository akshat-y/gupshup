from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum("admin", "tester", name="user_roles"), nullable=False)
    
    test_cases = relationship("TestCase", back_populates="owner")

class Session(Base):
    __tablename__ = 'sessions'
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User")
    expires_at = Column(DateTime)

    def is_active(self):
        expires_at_aware = self.expires_at.replace(tzinfo=timezone.utc) if self.expires_at.tzinfo is None else self.expires_at
        return datetime.now(timezone.utc) < expires_at_aware

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    jira_ticket_id = Column(String, nullable=False)
    
    test_cases = relationship("TestCase", back_populates="project")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_case_name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    input_data = Column(Text, nullable=False)
    expected_result = Column(Text, nullable=False)
    actual_result = Column(Text, nullable=False)
    status = Column(Enum("Pass", "Fail", name="test_case_status"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", back_populates="test_cases")
    project = relationship("Project", back_populates="test_cases")








# import requests

# # URL of the API endpoint
# url = "http://127.0.0.1:8000/users/"

# # User data to be sent in the request body
# user_data = {
#     "username": "akshat-yadav",    
#     "password": "akshatpassword",
#     "role": "tester"
# }

# # Make the POST request to create a user
# response = requests.post(url, json=user_data)

# # Print the response from the API
# print(response.status_code)
# print(response.json())
