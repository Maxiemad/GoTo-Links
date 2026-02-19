"""
Backend API Tests for Theme Selection System in GoToLinks
Tests PATCH /api/profile/theme endpoint and theme persistence
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('NEXT_PUBLIC_APP_URL', 'https://bio-links-app.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"
TEST_HANDLE = "testuser"

# Valid themes from lib/themes.ts
VALID_THEMES = [
    'zen-minimal',
    'sacred-earth', 
    'ocean-temple',
    'forest-calm',
    'sunset-glow',
    'lavender-dreams',
    'midnight-bloom',
    'rose-quartz'
]

class TestThemeAPI:
    """Theme API endpoint tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        """Create authenticated session"""
        s = requests.Session()
        # Login to get session cookie
        response = s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert data.get("success") is True, f"Login unsuccessful: {data}"
        return s
    
    def test_theme_endpoint_requires_auth(self):
        """Test that PATCH /api/profile/theme requires authentication"""
        response = requests.patch(
            f"{BASE_URL}/api/profile/theme",
            json={"theme": "ocean-temple"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        assert "authenticated" in data.get("error", "").lower() or data.get("error") == "Not authenticated"
        print("SUCCESS: Theme endpoint correctly requires authentication")
    
    def test_theme_update_invalid_theme(self, session):
        """Test that invalid theme names are rejected"""
        response = session.patch(
            f"{BASE_URL}/api/profile/theme",
            json={"theme": "invalid-theme-name"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: Invalid theme correctly rejected with 400")
    
    def test_theme_update_missing_theme(self, session):
        """Test that missing theme field is rejected"""
        response = session.patch(
            f"{BASE_URL}/api/profile/theme",
            json={},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: Missing theme field correctly rejected")
    
    def test_theme_update_success(self, session):
        """Test successful theme update - core functionality"""
        # Update to lavender-dreams theme
        response = session.patch(
            f"{BASE_URL}/api/profile/theme",
            json={"theme": "lavender-dreams"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Theme update failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        assert data.get("data", {}).get("theme") == "lavender-dreams"
        print("SUCCESS: Theme updated to lavender-dreams")
        
        # Verify persistence by fetching profile
        profile_response = requests.get(f"{BASE_URL}/api/profile/{TEST_HANDLE}")
        assert profile_response.status_code == 200
        profile_data = profile_response.json()
        assert profile_data.get("data", {}).get("profile", {}).get("theme") == "lavender-dreams"
        print("SUCCESS: Theme persisted correctly in database")
    
    def test_all_valid_themes(self, session):
        """Test that all 8 valid themes can be set"""
        for theme in VALID_THEMES:
            response = session.patch(
                f"{BASE_URL}/api/profile/theme",
                json={"theme": theme},
                headers={"Content-Type": "application/json"}
            )
            assert response.status_code == 200, f"Failed to set theme {theme}: {response.text}"
            data = response.json()
            assert data.get("success") is True
            assert data.get("data", {}).get("theme") == theme
            print(f"SUCCESS: Theme '{theme}' set correctly")
        print(f"SUCCESS: All {len(VALID_THEMES)} themes validated")


class TestPublicProfileAPI:
    """Public profile API tests"""
    
    def test_public_profile_returns_theme(self):
        """Test that public profile endpoint returns current theme"""
        response = requests.get(f"{BASE_URL}/api/profile/{TEST_HANDLE}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
        profile = data.get("data", {}).get("profile", {})
        assert "theme" in profile, "Theme field missing from profile"
        assert profile["theme"] in VALID_THEMES, f"Theme '{profile['theme']}' not in valid themes"
        print(f"SUCCESS: Public profile returns theme: {profile['theme']}")
    
    def test_public_profile_invalid_handle(self):
        """Test that invalid handle returns 404"""
        response = requests.get(f"{BASE_URL}/api/profile/nonexistent_user_12345")
        assert response.status_code == 404
        print("SUCCESS: Invalid handle correctly returns 404")


class TestLoginAPI:
    """Login API tests for session management"""
    
    def test_login_success(self):
        """Test successful login returns user data"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
        user = data.get("data", {}).get("user", {})
        assert user.get("email") == TEST_EMAIL
        assert user.get("handle") == TEST_HANDLE
        print(f"SUCCESS: Login returns correct user data")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": "wrongpassword"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: Invalid credentials correctly rejected")
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: Missing fields correctly rejected")


# Cleanup - reset theme to original
@pytest.fixture(scope="session", autouse=True)
def cleanup(request):
    """Reset theme to sunset-glow after all tests"""
    def reset_theme():
        s = requests.Session()
        s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        s.patch(
            f"{BASE_URL}/api/profile/theme",
            json={"theme": "sunset-glow"},
            headers={"Content-Type": "application/json"}
        )
        print("\nCleanup: Reset theme to sunset-glow")
    
    request.addfinalizer(reset_theme)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
