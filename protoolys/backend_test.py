#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Protooly
Tests all 15 endpoints plus edge cases
"""
import requests
import json
import sys
from typing import Dict, Any

# Read backend URL from frontend/.env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=')[1].strip() + '/api'
            break

print(f"Testing backend at: {BASE_URL}\n")

# Test results tracking
passed = 0
failed = 0
test_results = []

def test_endpoint(name: str, method: str, endpoint: str, expected_status: int = 200, 
                  data: Dict[str, Any] = None, validate_fn=None, description: str = ""):
    """Generic test function for API endpoints"""
    global passed, failed
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        elif method == "DELETE":
            response = requests.delete(url, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        # Check status code
        if response.status_code != expected_status:
            result = f"❌ FAILED: {name}"
            details = f"   Expected status {expected_status}, got {response.status_code}"
            details += f"\n   Response: {response.text[:200]}"
            test_results.append((result, details))
            failed += 1
            print(result)
            print(details)
            return None
        
        # Parse JSON response
        try:
            json_response = response.json()
        except:
            if expected_status == 200:
                result = f"❌ FAILED: {name}"
                details = f"   Could not parse JSON response: {response.text[:200]}"
                test_results.append((result, details))
                failed += 1
                print(result)
                print(details)
                return None
            json_response = None
        
        # Custom validation
        if validate_fn and json_response:
            validation_result = validate_fn(json_response)
            if validation_result is not True:
                result = f"❌ FAILED: {name}"
                details = f"   Validation failed: {validation_result}"
                details += f"\n   Response: {json.dumps(json_response, indent=2)[:300]}"
                test_results.append((result, details))
                failed += 1
                print(result)
                print(details)
                return None
        
        result = f"✅ PASSED: {name}"
        if description:
            result += f" - {description}"
        test_results.append((result, ""))
        passed += 1
        print(result)
        return json_response
        
    except requests.exceptions.Timeout:
        result = f"❌ FAILED: {name}"
        details = f"   Request timed out after 30 seconds"
        test_results.append((result, details))
        failed += 1
        print(result)
        print(details)
        return None
    except Exception as e:
        result = f"❌ FAILED: {name}"
        details = f"   Exception: {str(e)}"
        test_results.append((result, details))
        failed += 1
        print(result)
        print(details)
        return None


print("=" * 80)
print("PROTOOLY BACKEND API TEST SUITE")
print("=" * 80)
print()

# Test 1: Root endpoint
print("Test 1: GET /api/ - Service metadata")
test_endpoint(
    "Root endpoint",
    "GET",
    "/",
    validate_fn=lambda r: True if r.get("service") and r.get("version") else "Missing service or version field"
)
print()

# Test 2: Categories
print("Test 2: GET /api/categories - Get all categories")
categories_response = test_endpoint(
    "Get categories",
    "GET",
    "/categories",
    validate_fn=lambda r: True if isinstance(r, list) and len(r) == 14 else f"Expected 14 categories, got {len(r) if isinstance(r, list) else 'non-list'}"
)
if categories_response:
    # Validate structure
    if all('id' in cat and 'name' in cat for cat in categories_response):
        print("   ✓ All categories have 'id' and 'name' fields")
    else:
        print("   ⚠ Some categories missing 'id' or 'name' fields")
print()

# Test 3: Track tool usage
print("Test 3: POST /api/track - Track tool usage")
test_endpoint(
    "Track tool usage",
    "POST",
    "/track",
    data={"slug": "word-counter", "sessionId": "test-session-1"},
    validate_fn=lambda r: True if r.get("ok") is True else "Expected {ok: true}"
)
print()

# Test 4: Get popular tools
print("Test 4: GET /api/popular?limit=12 - Get popular tools")
popular_response = test_endpoint(
    "Get popular tools",
    "GET",
    "/popular?limit=12",
    validate_fn=lambda r: True if isinstance(r, list) else "Expected array response"
)
if popular_response:
    print(f"   ✓ Returned {len(popular_response)} popular tools")
    if len(popular_response) > 0 and 'slug' in popular_response[0]:
        print(f"   ✓ First tool: {popular_response[0].get('slug')} (count: {popular_response[0].get('count', 0)})")
print()

# Test 5: Get favorites (initially empty)
print("Test 5: GET /api/favorites/test-session-1 - Get favorites")
favorites_response = test_endpoint(
    "Get favorites (empty)",
    "GET",
    "/favorites/test-session-1",
    validate_fn=lambda r: True if isinstance(r, list) else "Expected array response"
)
print()

# Test 6: Add favorite (toggle on)
print("Test 6: POST /api/favorites/test-session-1 - Add favorite")
add_fav_response = test_endpoint(
    "Add favorite (json-formatter)",
    "POST",
    "/favorites/test-session-1",
    data={"slug": "json-formatter"},
    validate_fn=lambda r: True if r.get("slug") == "json-formatter" and r.get("favorited") is True else f"Expected favorited=true, got {r}"
)
print()

# Test 6b: Toggle favorite off
print("Test 6b: POST /api/favorites/test-session-1 - Toggle favorite off")
toggle_off_response = test_endpoint(
    "Toggle favorite off",
    "POST",
    "/favorites/test-session-1",
    data={"slug": "json-formatter"},
    validate_fn=lambda r: True if r.get("slug") == "json-formatter" and r.get("favorited") is False else f"Expected favorited=false, got {r}"
)
print()

# Test 6c: Add favorite back
print("Test 6c: POST /api/favorites/test-session-1 - Add favorite back")
add_back_response = test_endpoint(
    "Add favorite back",
    "POST",
    "/favorites/test-session-1",
    data={"slug": "json-formatter"},
    validate_fn=lambda r: True if r.get("slug") == "json-formatter" and r.get("favorited") is True else f"Expected favorited=true, got {r}"
)
print()

# Test 7: Delete favorite
print("Test 7: DELETE /api/favorites/test-session-1/json-formatter - Delete favorite")
delete_response = test_endpoint(
    "Delete favorite",
    "DELETE",
    "/favorites/test-session-1/json-formatter",
    validate_fn=lambda r: True if r.get("deleted") in [0, 1] else f"Expected deleted count, got {r}"
)
print()

# Test 8: HTTP Status
print("Test 8: POST /api/net/http-status - Check HTTP status")
http_status_response = test_endpoint(
    "HTTP status check",
    "POST",
    "/net/http-status",
    data={"url": "https://example.com"},
    validate_fn=lambda r: True if r.get("status") == 200 and "statusText" in r and "finalUrl" in r and "redirects" in r and "history" in r else f"Missing required fields in response"
)
print()

# Test 9: Get headers
print("Test 9: POST /api/net/headers - Get HTTP headers")
headers_response = test_endpoint(
    "Get HTTP headers",
    "POST",
    "/net/headers",
    data={"url": "https://example.com"},
    validate_fn=lambda r: True if "headers" in r and isinstance(r["headers"], dict) else "Expected headers dict"
)
print()

# Test 10: Page size
print("Test 10: POST /api/net/page-size - Get page size")
page_size_response = test_endpoint(
    "Get page size",
    "POST",
    "/net/page-size",
    data={"url": "https://example.com"},
    validate_fn=lambda r: True if all(k in r for k in ["bytes", "kb", "mb", "contentType", "status"]) else f"Missing required fields"
)
print()

# Test 11: Domain to IP
print("Test 11: POST /api/net/domain-to-ip - Resolve domain to IP")
domain_ip_response = test_endpoint(
    "Domain to IP",
    "POST",
    "/net/domain-to-ip",
    data={"domain": "example.com"},
    validate_fn=lambda r: True if "domain" in r and "ipv4" in r and "ipv6" in r and isinstance(r["ipv4"], list) and isinstance(r["ipv6"], list) else "Missing or invalid fields"
)
if domain_ip_response and domain_ip_response.get("ipv4"):
    print(f"   ✓ Resolved to IPv4: {domain_ip_response['ipv4']}")
print()

# Test 12: DNS records
print("Test 12: POST /api/net/dns-records - Get DNS records")
dns_response = test_endpoint(
    "Get DNS records",
    "POST",
    "/net/dns-records",
    data={"domain": "google.com"},
    validate_fn=lambda r: True if "domain" in r and "records" in r and isinstance(r["records"], dict) else "Missing or invalid fields"
)
if dns_response and dns_response.get("records"):
    record_types = list(dns_response["records"].keys())
    print(f"   ✓ Record types returned: {', '.join(record_types)}")
print()

# Test 13: Server status
print("Test 13: POST /api/net/server-status - Check server status")
server_status_response = test_endpoint(
    "Server status check",
    "POST",
    "/net/server-status",
    data={"url": "https://example.com"},
    validate_fn=lambda r: True if "up" in r and "status" in r and "latencyMs" in r else "Missing required fields"
)
if server_status_response:
    print(f"   ✓ Server up: {server_status_response.get('up')}, Latency: {server_status_response.get('latencyMs')}ms")
print()

# Test 14: Redirect chain
print("Test 14: POST /api/net/redirect-chain - Get redirect chain")
redirect_response = test_endpoint(
    "Redirect chain",
    "POST",
    "/net/redirect-chain",
    data={"url": "http://google.com"},
    validate_fn=lambda r: True if "start" in r and "chain" in r and "hops" in r and isinstance(r["chain"], list) else "Missing or invalid fields"
)
if redirect_response:
    print(f"   ✓ Redirect hops: {redirect_response.get('hops')}")
    if redirect_response.get("chain"):
        print(f"   ✓ Final URL: {redirect_response['chain'][-1].get('url')}")
print()

# Test 15: Contact form
print("Test 15: POST /api/contact - Submit contact form")
contact_response = test_endpoint(
    "Contact form submission",
    "POST",
    "/contact",
    data={"name": "Test User", "email": "test@example.com", "message": "Test message"},
    validate_fn=lambda r: True if "id" in r and r.get("ok") is True else "Missing id or ok field"
)
print()

# EDGE CASES
print("=" * 80)
print("EDGE CASE TESTS")
print("=" * 80)
print()

# Edge case 1: Empty slug in track
print("Edge Case 1: POST /api/track with empty slug (should return 400)")
test_endpoint(
    "Track with empty slug",
    "POST",
    "/track",
    expected_status=400,
    data={"slug": "", "sessionId": "test-session-1"}
)
print()

# Edge case 2: Malformed URL
print("Edge Case 2: POST /api/net/http-status with unreachable host (should return 502 or error)")
malformed_response = test_endpoint(
    "HTTP status with unreachable host",
    "POST",
    "/net/http-status",
    expected_status=502,
    data={"url": "https://this-domain-definitely-does-not-exist-12345.com"}
)
print()

# Edge case 3: URL normalization without scheme
print("Edge Case 3: POST /api/net/http-status with domain without scheme (should normalize)")
normalized_response = test_endpoint(
    "HTTP status with domain normalization",
    "POST",
    "/net/http-status",
    data={"url": "example.com"},
    validate_fn=lambda r: True if r.get("status") == 200 else f"Expected status 200, got {r.get('status')}"
)
if normalized_response:
    print(f"   ✓ URL normalized to: {normalized_response.get('url')}")
print()

# Edge case 4: Domain normalization for domain-to-ip
print("Edge Case 4: POST /api/net/domain-to-ip with URL instead of domain")
domain_norm_response = test_endpoint(
    "Domain to IP with URL normalization",
    "POST",
    "/net/domain-to-ip",
    data={"domain": "https://example.com"},
    validate_fn=lambda r: True if r.get("domain") == "example.com" else f"Expected domain 'example.com', got {r.get('domain')}"
)
print()

# SUMMARY
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total Tests: {passed + failed}")
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print()

if failed > 0:
    print("FAILED TESTS:")
    print("-" * 80)
    for result, details in test_results:
        if result.startswith("❌"):
            print(result)
            if details:
                print(details)
            print()

# Exit with appropriate code
sys.exit(0 if failed == 0 else 1)
