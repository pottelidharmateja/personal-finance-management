import pytest
import requests

BASE_URL = "http://localhost:8000"  

@pytest.fixture
def user_details():
    return {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword"
    }

def test_user_registration(user_details):
    """Test Case 1.1: Verify user registration with valid details."""
    response = requests.post(f"{BASE_URL}/api/register/", json=user_details)
    assert response.status_code == 201
    assert "id" in response.json()

def test_login_valid_user(user_details):
    """Test Case 1.2: Verify that login works for a registered user with valid credentials."""
    # First, register the user
    requests.post(f"{BASE_URL}/api/register/", json=user_details)
    # Then, log in with valid credentials
    response = requests.post(f"{BASE_URL}/api/login/", json={
        "username": user_details["username"],
        "password": user_details["password"]
    })
    assert response.status_code == 200
    assert "token" in response.json()

def test_login_unregistered_user():
    """Test Case 1.3: Verify that login fails for an unregistered user."""
    response = requests.post(f"{BASE_URL}/api/login/", json={
        "username": "unregistereduser",
        "password": "somepassword"
    })
    assert response.status_code == 401
    assert response.json().get("error") == "Invalid credentials"

def test_incorrect_password(user_details):
    """Test Case 1.4: Test incorrect password entry, ensuring error messages are displayed."""
    # First, register the user
    requests.post(f"{BASE_URL}/api/register/", json=user_details)
    # Attempt to log in with incorrect password
    response = requests.post(f"{BASE_URL}/api/login/", json={
        "username": user_details["username"],
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json().get("error") == "Invalid credentials"


def test_reset_password(user_details):
    """Test Case 1.5: Verify that a user can reset their password through email."""
    # First, register the user
    requests.post(f"{BASE_URL}/api/register/", json=user_details)
    # Request password reset
    response = requests.post(f"{BASE_URL}/api/reset-password/", json={
        "email": user_details["email"]
    })
    assert response.status_code == 200
    assert response.json().get("message") == "Password reset link sent to email"

def test_session_expiry(user_details):
    """Test Case 1.6: Verify session expiry after a defined period of inactivity."""
    # First, register and log in the user
    requests.post(f"{BASE_URL}/api/register/", json=user_details)
    login_response = requests.post(f"{BASE_URL}/api/login/", json={
        "username": user_details["username"],
        "password": user_details["password"]
    })
    token = login_response.json().get("token")
    # Simulate session expiry (e.g., after 30 minutes)
    import time
    time.sleep(30 * 60)  # Wait for 30 minutes
    # Try to access a protected route with the expired token
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/protected/", headers=headers)
    assert response.status_code == 401
    assert response.json().get("error") == "Session expired"

