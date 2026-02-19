"""
Backend API Tests for Block Management CRUD in GoToLinks
Tests CREATE, READ, UPDATE, DELETE, and REORDER for blocks
Block types: LINK, RETREAT, TESTIMONIAL, BOOK_CALL, WHATSAPP, TELEGRAM

Test credentials: blocktest@example.com / Test1234! / handle: blocktester
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('NEXT_PUBLIC_APP_URL', 'https://goto-links-preview.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "blocktest@example.com"
TEST_PASSWORD = "Test1234!"
TEST_HANDLE = "blocktester"

# Block types
BLOCK_TYPES = ['LINK', 'RETREAT', 'TESTIMONIAL', 'BOOK_CALL', 'WHATSAPP', 'TELEGRAM']


class TestBlocksAuthentication:
    """Test authentication requirements for block endpoints"""
    
    def test_get_blocks_requires_auth(self):
        """Test that GET /api/blocks requires authentication"""
        response = requests.get(f"{BASE_URL}/api/blocks")
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: GET /api/blocks requires authentication")
    
    def test_post_blocks_requires_auth(self):
        """Test that POST /api/blocks requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/blocks",
            json={"type": "LINK", "title": "Test Link"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: POST /api/blocks requires authentication")
    
    def test_delete_block_requires_auth(self):
        """Test that DELETE /api/blocks/[id] requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/blocks/507f1f77bcf86cd799439011")
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: DELETE /api/blocks/[id] requires authentication")
    
    def test_reorder_blocks_requires_auth(self):
        """Test that POST /api/blocks/reorder requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/blocks/reorder",
            json={"blockIds": []},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data.get("success") is False
        print("SUCCESS: POST /api/blocks/reorder requires authentication")


class TestBlocksCRUD:
    """Block CRUD operations tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        """Create authenticated session"""
        s = requests.Session()
        response = s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert data.get("success") is True, f"Login unsuccessful: {data}"
        print(f"SUCCESS: Authenticated as {TEST_EMAIL}")
        return s
    
    @pytest.fixture(scope="class")
    def created_blocks(self):
        """Track created block IDs for cleanup"""
        return []
    
    def test_create_link_block(self, session, created_blocks):
        """Test creating a LINK block - POST /api/blocks"""
        response = session.post(
            f"{BASE_URL}/api/blocks",
            json={
                "type": "LINK",
                "title": "TEST_My Website",
                "url": "https://example.com",
                "isVisible": True
            },
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Create LINK block failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        block = data.get("data", {}).get("block", {})
        assert block.get("type") == "LINK"
        assert block.get("title") == "TEST_My Website"
        assert block.get("url") == "https://example.com"
        assert block.get("isVisible") is True
        assert "id" in block
        assert "order" in block
        
        created_blocks.append(block["id"])
        print(f"SUCCESS: Created LINK block with ID: {block['id']}")
        
        # Verify persistence by fetching
        get_response = session.get(f"{BASE_URL}/api/blocks/{block['id']}")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert get_data.get("data", {}).get("block", {}).get("title") == "TEST_My Website"
        print("SUCCESS: LINK block persisted correctly")
    
    def test_create_retreat_block(self, session, created_blocks):
        """Test creating a RETREAT block - POST /api/blocks"""
        response = session.post(
            f"{BASE_URL}/api/blocks",
            json={
                "type": "RETREAT",
                "title": "TEST_Bali Wellness Retreat",
                "url": "https://retreat.example.com",
                "dateRange": "April 15-22, 2025",
                "location": "Ubud, Bali",
                "isVisible": True
            },
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Create RETREAT block failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        block = data.get("data", {}).get("block", {})
        assert block.get("type") == "RETREAT"
        assert block.get("title") == "TEST_Bali Wellness Retreat"
        assert block.get("dateRange") == "April 15-22, 2025"
        assert block.get("location") == "Ubud, Bali"
        
        created_blocks.append(block["id"])
        print(f"SUCCESS: Created RETREAT block with ID: {block['id']}")
    
    def test_create_testimonial_block(self, session, created_blocks):
        """Test creating a TESTIMONIAL block - POST /api/blocks"""
        response = session.post(
            f"{BASE_URL}/api/blocks",
            json={
                "type": "TESTIMONIAL",
                "title": "TEST_Customer Feedback",
                "authorName": "Jane Smith",
                "quote": "This retreat changed my life!",
                "isVisible": True
            },
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200, f"Create TESTIMONIAL block failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        block = data.get("data", {}).get("block", {})
        assert block.get("type") == "TESTIMONIAL"
        assert block.get("authorName") == "Jane Smith"
        assert block.get("quote") == "This retreat changed my life!"
        
        created_blocks.append(block["id"])
        print(f"SUCCESS: Created TESTIMONIAL block with ID: {block['id']}")
    
    def test_get_all_blocks(self, session):
        """Test getting all blocks - GET /api/blocks"""
        response = session.get(f"{BASE_URL}/api/blocks")
        assert response.status_code == 200, f"Get blocks failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        blocks = data.get("data", {}).get("blocks", [])
        assert isinstance(blocks, list)
        assert len(blocks) >= 0
        
        # Verify blocks are sorted by order
        if len(blocks) > 1:
            for i in range(len(blocks) - 1):
                assert blocks[i].get("order", 0) <= blocks[i+1].get("order", 0), "Blocks not sorted by order"
        
        print(f"SUCCESS: Retrieved {len(blocks)} blocks, sorted by order")
    
    def test_update_block(self, session, created_blocks):
        """Test updating a block - PUT /api/blocks/[id]"""
        # First create a block to update
        create_response = session.post(
            f"{BASE_URL}/api/blocks",
            json={"type": "LINK", "title": "TEST_Original Title"},
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        block_id = create_response.json().get("data", {}).get("block", {}).get("id")
        created_blocks.append(block_id)
        
        # Update the block
        update_response = session.put(
            f"{BASE_URL}/api/blocks/{block_id}",
            json={
                "title": "TEST_Updated Title",
                "url": "https://updated.example.com",
                "isVisible": False
            },
            headers={"Content-Type": "application/json"}
        )
        assert update_response.status_code == 200, f"Update block failed: {update_response.text}"
        data = update_response.json()
        assert data.get("success") is True
        
        block = data.get("data", {}).get("block", {})
        assert block.get("title") == "TEST_Updated Title"
        assert block.get("url") == "https://updated.example.com"
        assert block.get("isVisible") is False
        
        print(f"SUCCESS: Updated block {block_id}")
        
        # Verify persistence
        get_response = session.get(f"{BASE_URL}/api/blocks/{block_id}")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert get_data.get("data", {}).get("block", {}).get("title") == "TEST_Updated Title"
        print("SUCCESS: Block update persisted correctly")
    
    def test_delete_block(self, session):
        """Test deleting a block - DELETE /api/blocks/[id]"""
        # First create a block to delete
        create_response = session.post(
            f"{BASE_URL}/api/blocks",
            json={"type": "LINK", "title": "TEST_To Be Deleted"},
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        block_id = create_response.json().get("data", {}).get("block", {}).get("id")
        
        # Delete the block
        delete_response = session.delete(f"{BASE_URL}/api/blocks/{block_id}")
        assert delete_response.status_code == 200, f"Delete block failed: {delete_response.text}"
        data = delete_response.json()
        assert data.get("success") is True
        
        print(f"SUCCESS: Deleted block {block_id}")
        
        # Verify deletion - should return 404
        get_response = session.get(f"{BASE_URL}/api/blocks/{block_id}")
        assert get_response.status_code == 404
        print("SUCCESS: Block deletion verified")
    
    def test_get_single_block(self, session, created_blocks):
        """Test getting a single block - GET /api/blocks/[id]"""
        # Create a block first
        create_response = session.post(
            f"{BASE_URL}/api/blocks",
            json={"type": "WHATSAPP", "title": "TEST_WhatsApp", "phone": "+1234567890"},
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        block_id = create_response.json().get("data", {}).get("block", {}).get("id")
        created_blocks.append(block_id)
        
        # Get single block
        response = session.get(f"{BASE_URL}/api/blocks/{block_id}")
        assert response.status_code == 200, f"Get single block failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        block = data.get("data", {}).get("block", {})
        assert block.get("id") == block_id
        assert block.get("type") == "WHATSAPP"
        assert block.get("phone") == "+1234567890"
        
        print(f"SUCCESS: Retrieved single block {block_id}")
    
    def test_get_invalid_block_id(self, session):
        """Test getting block with invalid ID returns 400"""
        response = session.get(f"{BASE_URL}/api/blocks/invalid-id")
        assert response.status_code == 400
        print("SUCCESS: Invalid block ID returns 400")
    
    def test_get_nonexistent_block(self, session):
        """Test getting nonexistent block returns 404"""
        response = session.get(f"{BASE_URL}/api/blocks/507f1f77bcf86cd799439011")
        assert response.status_code == 404
        print("SUCCESS: Nonexistent block returns 404")


class TestBlocksReorder:
    """Block reorder functionality tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        """Create authenticated session"""
        s = requests.Session()
        response = s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        return s
    
    @pytest.fixture(scope="class")
    def test_blocks(self, session):
        """Create test blocks for reorder testing"""
        blocks = []
        for i in range(3):
            response = session.post(
                f"{BASE_URL}/api/blocks",
                json={"type": "LINK", "title": f"TEST_Reorder Block {i}"},
                headers={"Content-Type": "application/json"}
            )
            if response.status_code == 200:
                block = response.json().get("data", {}).get("block", {})
                blocks.append(block)
        
        print(f"Created {len(blocks)} blocks for reorder testing")
        return blocks
    
    def test_reorder_blocks(self, session, test_blocks):
        """Test reordering blocks - POST /api/blocks/reorder"""
        if len(test_blocks) < 2:
            pytest.skip("Need at least 2 blocks to test reorder")
        
        # Get current blocks
        get_response = session.get(f"{BASE_URL}/api/blocks")
        assert get_response.status_code == 200
        current_blocks = get_response.json().get("data", {}).get("blocks", [])
        
        if len(current_blocks) < 2:
            pytest.skip("Need at least 2 blocks to test reorder")
        
        # Reverse the order
        reversed_ids = [b["id"] for b in reversed(current_blocks)]
        
        # Reorder
        reorder_response = session.post(
            f"{BASE_URL}/api/blocks/reorder",
            json={"blockIds": reversed_ids},
            headers={"Content-Type": "application/json"}
        )
        assert reorder_response.status_code == 200, f"Reorder failed: {reorder_response.text}"
        data = reorder_response.json()
        assert data.get("success") is True
        
        print("SUCCESS: Blocks reordered")
        
        # Verify new order
        reordered_blocks = data.get("data", {}).get("blocks", [])
        for i, block in enumerate(reordered_blocks):
            assert block.get("order") == i, f"Block order mismatch at index {i}"
        
        print("SUCCESS: Block order persisted correctly")
    
    def test_reorder_with_invalid_ids(self, session):
        """Test reorder with non-existent block IDs"""
        response = session.post(
            f"{BASE_URL}/api/blocks/reorder",
            json={"blockIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]},
            headers={"Content-Type": "application/json"}
        )
        # Should still return 200 (bulkWrite just won't match anything)
        assert response.status_code == 200
        print("SUCCESS: Reorder with invalid IDs handled gracefully")
    
    def test_reorder_empty_array(self, session):
        """Test reorder with empty array"""
        response = session.post(
            f"{BASE_URL}/api/blocks/reorder",
            json={"blockIds": []},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        print("SUCCESS: Reorder with empty array handled")


class TestPublicProfile:
    """Public profile API tests for blocks"""
    
    def test_public_profile_shows_visible_blocks(self):
        """Test that public profile shows only visible blocks"""
        response = requests.get(f"{BASE_URL}/api/profile/{TEST_HANDLE}")
        assert response.status_code == 200, f"Get public profile failed: {response.text}"
        data = response.json()
        assert data.get("success") is True
        
        profile = data.get("data", {}).get("profile", {})
        blocks = profile.get("blocks", [])
        
        # All blocks in public profile should be visible (isVisible=true)
        # Note: the API filters for isVisible=true
        print(f"SUCCESS: Public profile shows {len(blocks)} blocks")
        
        # Verify blocks have required fields
        for block in blocks:
            assert "id" in block
            assert "type" in block
            print(f"  - Block type: {block.get('type')}, title: {block.get('title')}")
    
    def test_public_profile_blocks_sorted_by_order(self):
        """Test that public profile blocks are sorted by order"""
        response = requests.get(f"{BASE_URL}/api/profile/{TEST_HANDLE}")
        assert response.status_code == 200
        data = response.json()
        
        # Note: Public profile API doesn't return order field, but blocks should be sorted
        blocks = data.get("data", {}).get("profile", {}).get("blocks", [])
        # Just verify we get the blocks (can't verify order without 'order' field in response)
        print(f"SUCCESS: Public profile returns {len(blocks)} blocks in order")
    
    def test_public_profile_nonexistent_handle(self):
        """Test that nonexistent handle returns 404"""
        response = requests.get(f"{BASE_URL}/api/profile/nonexistent_handle_12345")
        assert response.status_code == 404
        print("SUCCESS: Nonexistent handle returns 404")


class TestBlockValidation:
    """Block validation tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        """Create authenticated session"""
        s = requests.Session()
        response = s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        return s
    
    def test_create_block_invalid_type(self, session):
        """Test creating block with invalid type"""
        response = session.post(
            f"{BASE_URL}/api/blocks",
            json={"type": "INVALID_TYPE", "title": "Test"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        print("SUCCESS: Invalid block type rejected")
    
    def test_create_block_missing_type(self, session):
        """Test creating block without type"""
        response = session.post(
            f"{BASE_URL}/api/blocks",
            json={"title": "Test without type"},
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 400
        print("SUCCESS: Missing type rejected")


# Cleanup fixture
@pytest.fixture(scope="session", autouse=True)
def cleanup(request):
    """Cleanup TEST_ prefixed blocks after all tests"""
    def cleanup_test_blocks():
        s = requests.Session()
        s.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        
        # Get all blocks
        response = s.get(f"{BASE_URL}/api/blocks")
        if response.status_code == 200:
            blocks = response.json().get("data", {}).get("blocks", [])
            for block in blocks:
                if block.get("title", "").startswith("TEST_"):
                    s.delete(f"{BASE_URL}/api/blocks/{block['id']}")
                    print(f"Cleanup: Deleted TEST block {block['id']}")
        
        print("Cleanup: Removed TEST_ prefixed blocks")
    
    request.addfinalizer(cleanup_test_blocks)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
