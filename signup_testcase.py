import pytest
import requests

BASE_URL = "http://localhost:8000"  

@pytest.fixture
def new_user_details():
    return {
        "username": "newtestuser",
        "email": "newtestuser@example.com",
        "password": "strongpassword",
        "confirm_password": "strongpassword"
    }

def test_valid_user_registration(new_user_details):
    """Test Case 1.1: Verify user registration with valid details."""
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 201
    assert "id" in response.json()

def test_registration_with_existing_username(new_user_details):
    """Test Case 1.2: Verify registration fails for existing username."""
    # First, register the user
    requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    # Attempt to register again with the same username
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Username already exists"

def test_registration_with_invalid_email(new_user_details):
    """Test Case 1.3: Verify registration fails for invalid email format."""
    new_user_details["email"] = "invalidemail"
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Invalid email format"

def test_password_confirm_password_mismatch(new_user_details):
    """Test Case 1.4: Verify registration fails for password mismatch."""
    new_user_details["confirm_password"] = "differentpassword"
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Passwords do not match"

def test_weak_password(new_user_details):
    """Test Case 1.5: Verify registration fails for weak password."""
    new_user_details["password"] = "12345"
    new_user_details["confirm_password"] = "12345"
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Password is too weak"

def test_missing_required_fields():
    """Test Case 1.6: Verify registration fails for missing required fields."""
    response = requests.post(f"{BASE_URL}/api/register/", json={
        "username": "",
        "email": "",
        "password": "",
        "confirm_password": ""
    })
    assert response.status_code == 400
    assert response.json().get("error") == "Missing required fields"

def test_registration_with_special_characters_in_username(new_user_details):
    """Test Case 1.7: Verify registration fails for invalid username (special characters)."""
    new_user_details["username"] = "@invalid_user!"
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Invalid username format"

def test_registration_with_existing_email(new_user_details):
    """Test Case 1.8: Verify registration fails for existing email."""
    # First, register the user
    requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    # Attempt to register again with the same email
    new_user_details["username"] = "anotheruser"
    response = requests.post(f"{BASE_URL}/api/register/", json=new_user_details)
    assert response.status_code == 400
    assert response.json().get("error") == "Email already registered"