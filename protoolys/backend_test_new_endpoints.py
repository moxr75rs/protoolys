#!/usr/bin/env python3
"""
Backend API Test Suite for NEW Protooly Endpoints
Tests 9 AI endpoints + 1 YouTube endpoint + edge cases
"""
import requests
import json
import sys
import re
from typing import Dict, Any

# Read backend URL from frontend/.env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=')[1].strip() + '/api'
            break

print(f"Testing NEW endpoints at: {BASE_URL}\n")

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
            response = requests.get(url, timeout=60)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=60)
        elif method == "DELETE":
            response = requests.delete(url, timeout=60)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        # Check status code
        if response.status_code != expected_status:
            result = f"❌ FAILED: {name}"
            details = f"   Expected status {expected_status}, got {response.status_code}"
            details += f"\n   URL: {url}"
            details += f"\n   Response: {response.text[:500]}"
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
                details = f"   Could not parse JSON response"
                details += f"\n   URL: {url}"
                details += f"\n   Response: {response.text[:500]}"
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
                details += f"\n   URL: {url}"
                details += f"\n   Response: {json.dumps(json_response, indent=2)[:500]}"
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
        details = f"   Request timed out after 60 seconds"
        details += f"\n   URL: {url}"
        test_results.append((result, details))
        failed += 1
        print(result)
        print(details)
        return None
    except Exception as e:
        result = f"❌ FAILED: {name}"
        details = f"   Exception: {str(e)}"
        details += f"\n   URL: {url}"
        test_results.append((result, details))
        failed += 1
        print(result)
        print(details)
        return None


print("=" * 80)
print("PROTOOLY NEW ENDPOINTS TEST SUITE")
print("=" * 80)
print()

# ============================================================================
# AI ENDPOINTS (9 tests)
# ============================================================================
print("=" * 80)
print("AI ENDPOINTS (Powered by Emergent LLM)")
print("=" * 80)
print()

# Test 1: AI Summarize
print("Test 1: POST /api/ai/summarize - Summarize text")
summarize_response = test_endpoint(
    "AI Summarize",
    "POST",
    "/ai/summarize",
    data={
        "text": "Artificial intelligence is transforming industries from healthcare to finance. AI algorithms can now diagnose diseases, drive cars, and generate creative content. However, challenges remain around ethics, bias, and job displacement that society must address."
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if summarize_response:
    print(f"   ✓ Result preview: {summarize_response.get('result', '')[:150]}...")
print()

# Test 2: AI Paraphrase
print("Test 2: POST /api/ai/paraphrase - Paraphrase text")
paraphrase_response = test_endpoint(
    "AI Paraphrase",
    "POST",
    "/ai/paraphrase",
    data={
        "text": "The quick brown fox jumps over the lazy dog.",
        "extra": "formal"
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if paraphrase_response:
    print(f"   ✓ Result: {paraphrase_response.get('result', '')}")
print()

# Test 3: AI Translate
print("Test 3: POST /api/ai/translate - Translate text")
translate_response = test_endpoint(
    "AI Translate",
    "POST",
    "/ai/translate",
    data={
        "text": "Hello, how are you?",
        "extra": "Spanish"
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if translate_response:
    print(f"   ✓ Result: {translate_response.get('result', '')}")
print()

# Test 4: AI Generate
print("Test 4: POST /api/ai/generate - Generate content")
generate_response = test_endpoint(
    "AI Generate",
    "POST",
    "/ai/generate",
    data={
        "text": "benefits of meditation",
        "extra": "100 words, professional"
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if generate_response:
    result_text = generate_response.get('result', '')
    word_count = len(result_text.split())
    print(f"   ✓ Generated {word_count} words")
    print(f"   ✓ Result preview: {result_text[:150]}...")
print()

# Test 5: AI Grammar
print("Test 5: POST /api/ai/grammar - Fix grammar")
grammar_response = test_endpoint(
    "AI Grammar",
    "POST",
    "/ai/grammar",
    data={
        "text": "she dont know nothing about it"
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if grammar_response:
    print(f"   ✓ Result: {grammar_response.get('result', '')}")
print()

# Test 6: AI Humanize
print("Test 6: POST /api/ai/humanize - Humanize text")
humanize_response = test_endpoint(
    "AI Humanize",
    "POST",
    "/ai/humanize",
    data={
        "text": "Furthermore, the implementation of advanced methodologies facilitates optimal outcomes."
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if humanize_response:
    print(f"   ✓ Result: {humanize_response.get('result', '')}")
print()

# Test 7: AI Rewrite
print("Test 7: POST /api/ai/rewrite - Rewrite text")
rewrite_response = test_endpoint(
    "AI Rewrite",
    "POST",
    "/ai/rewrite",
    data={
        "text": "Coffee is one of the most popular beverages in the world, consumed by millions every day."
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if rewrite_response:
    print(f"   ✓ Result: {rewrite_response.get('result', '')}")
print()

# Test 8: AI Citation
print("Test 8: POST /api/ai/citation - Generate citation")
citation_response = test_endpoint(
    "AI Citation",
    "POST",
    "/ai/citation",
    data={
        "text": "Smith, J. (2024). The Future of AI. Tech Press.",
        "extra": "MLA"
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if citation_response:
    print(f"   ✓ Result: {citation_response.get('result', '')}")
print()

# Test 9: AI Detect
print("Test 9: POST /api/ai/detect - Detect AI-generated text")
detect_response = test_endpoint(
    "AI Detect",
    "POST",
    "/ai/detect",
    data={
        "text": "This is a sample text to analyze for AI detection."
    },
    validate_fn=lambda r: True if r.get("result") and len(r.get("result", "")) > 0 else "Expected non-empty result field"
)
if detect_response:
    result_text = detect_response.get('result', '')
    print(f"   ✓ Result: {result_text}")
    # Try to parse as JSON to verify format
    try:
        if '{' in result_text and '}' in result_text:
            print(f"   ✓ Response contains JSON-formatted classification")
    except:
        pass
print()

# ============================================================================
# YOUTUBE ENDPOINT (1 test)
# ============================================================================
print("=" * 80)
print("YOUTUBE ENDPOINT")
print("=" * 80)
print()

# Test 10: YouTube Info
print("Test 10: POST /api/yt/info - Get YouTube video info")
yt_response = test_endpoint(
    "YouTube Info",
    "POST",
    "/yt/info",
    data={
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    validate_fn=lambda r: (
        True if all(k in r for k in ["videoId", "title", "author", "channelUrl", "thumbnails", "embed"]) 
        else f"Missing required fields. Got: {list(r.keys())}"
    )
)
if yt_response:
    print(f"   ✓ Video ID: {yt_response.get('videoId')}")
    print(f"   ✓ Title: {yt_response.get('title')}")
    print(f"   ✓ Author: {yt_response.get('author')}")
    print(f"   ✓ Channel URL: {yt_response.get('channelUrl')}")
    
    # Validate thumbnails
    thumbnails = yt_response.get('thumbnails', {})
    required_thumbs = ['default', 'medium', 'high', 'standard', 'maxres']
    for thumb_type in required_thumbs:
        if thumb_type in thumbnails:
            thumb_url = thumbnails[thumb_type]
            if thumb_url.startswith('https://i.ytimg.com/vi/dQw4w9WgXcQ/'):
                print(f"   ✓ Thumbnail '{thumb_type}': {thumb_url}")
            else:
                print(f"   ⚠ Thumbnail '{thumb_type}' has unexpected URL: {thumb_url}")
        else:
            print(f"   ❌ Missing thumbnail: {thumb_type}")
    
    # Validate embed
    embed = yt_response.get('embed', '')
    if '<iframe' in embed and 'youtube.com/embed/dQw4w9WgXcQ' in embed:
        print(f"   ✓ Embed contains valid iframe")
    else:
        print(f"   ⚠ Embed may be invalid: {embed[:100]}...")
print()

# ============================================================================
# EDGE CASES
# ============================================================================
print("=" * 80)
print("EDGE CASE TESTS")
print("=" * 80)
print()

# Edge case 1: Invalid YouTube URL
print("Edge Case 1: POST /api/yt/info with invalid URL (should return 400)")
test_endpoint(
    "YouTube Info with invalid URL",
    "POST",
    "/yt/info",
    expected_status=400,
    data={"url": "https://example.com"}
)
print()

# Edge case 2: Empty text in AI summarize
print("Edge Case 2: POST /api/ai/summarize with empty text")
empty_text_response = test_endpoint(
    "AI Summarize with empty text",
    "POST",
    "/ai/summarize",
    data={"text": ""},
    validate_fn=lambda r: True if "result" in r else "Expected result field"
)
if empty_text_response:
    print(f"   ✓ Handled empty text gracefully: {empty_text_response.get('result', '')[:100]}")
print()

# ============================================================================
# SUMMARY
# ============================================================================
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
else:
    print("🎉 ALL TESTS PASSED!")
    print()

# Exit with appropriate code
sys.exit(0 if failed == 0 else 1)
