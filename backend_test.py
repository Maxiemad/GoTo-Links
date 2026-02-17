#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class AuthAPITester:
    def __init__(self, base_url="https://theme-fix-preview.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}@test.com"
        self.test_password = "test12345"

    def log_test(self, name, success, response_code, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - Status: {response_code}")
        else:
            print(f"❌ {name} - Status: {response_code} - {details}")
        
        return success

    def test_signup(self):
        """Test user signup via API"""
        print(f"\n🔍 Testing Signup API with email: {self.test_user_email}")
        
        url = f"{self.base_url}/api/auth/signup"
        payload = {
            "email": self.test_user_email,
            "password": self.test_password,
            "firstName": "Test",
            "lastName": "User"
        }
        
        try:
            response = self.session.post(url, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"   User created with ID: {data['data']['user']['id']}")
                    print(f"   Handle: {data['data']['user']['handle']}")
                    return self.log_test("Signup API", True, response.status_code)
                else:
                    return self.log_test("Signup API", False, response.status_code, data.get('error', 'Unknown error'))
            else:
                return self.log_test("Signup API", False, response.status_code, response.text[:100])
                
        except Exception as e:
            return self.log_test("Signup API", False, "ERROR", str(e))

    def test_login(self):
        """Test user login via API"""
        print(f"\n🔍 Testing Login API with email: {self.test_user_email}")
        
        url = f"{self.base_url}/api/auth/login"
        payload = {
            "email": self.test_user_email,
            "password": self.test_password
        }
        
        try:
            response = self.session.post(url, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"   Login successful for user: {data['data']['user']['email']}")
                    print(f"   Session cookie set: {'session_token' in [cookie.name for cookie in response.cookies]}")
                    return self.log_test("Login API", True, response.status_code)
                else:
                    return self.log_test("Login API", False, response.status_code, data.get('error', 'Unknown error'))
            else:
                return self.log_test("Login API", False, response.status_code, response.text[:100])
                
        except Exception as e:
            return self.log_test("Login API", False, "ERROR", str(e))

    def test_auth_me(self):
        """Test /api/auth/me endpoint to check if session works"""
        print(f"\n🔍 Testing Auth Me API (session check)")
        
        url = f"{self.base_url}/api/auth/me"
        
        try:
            response = self.session.get(url)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"   Session valid for user: {data['data']['user']['email']}")
                    return self.log_test("Auth Me API", True, response.status_code)
                else:
                    return self.log_test("Auth Me API", False, response.status_code, data.get('error', 'Session invalid'))
            else:
                return self.log_test("Auth Me API", False, response.status_code, response.text[:100])
                
        except Exception as e:
            return self.log_test("Auth Me API", False, "ERROR", str(e))

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        print(f"\n🔍 Testing Login API with invalid credentials")
        
        url = f"{self.base_url}/api/auth/login"
        payload = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(url, json=payload)
            
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'Invalid' in data.get('error', ''):
                    return self.log_test("Invalid Login Test", True, response.status_code)
                else:
                    return self.log_test("Invalid Login Test", False, response.status_code, "Should return error message")
            else:
                return self.log_test("Invalid Login Test", False, response.status_code, "Should return 401")
                
        except Exception as e:
            return self.log_test("Invalid Login Test", False, "ERROR", str(e))

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Authentication API Tests")
        print("=" * 50)
        
        # Test signup
        signup_success = self.test_signup()
        
        if signup_success:
            # Test login
            login_success = self.test_login()
            
            if login_success:
                # Test session validation
                self.test_auth_me()
        
        # Test invalid login regardless of signup success
        self.test_login_invalid_credentials()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1

def main():
    tester = AuthAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())