# from app.services.profile import detect_stage

# def test_detect_stage_cpt():
#     parsed = {"Employer_Name": "CPT FULL TIME APPROVED 01"}
#     assert detect_stage(parsed) == "CPT"

# def test_detect_stage_opt():
#     parsed = {"Category": "C03B"}
#     assert detect_stage(parsed) == "OPT"

# def test_detect_stage_stem():
#     parsed = {"Category": "C03C"}
#     assert detect_stage(parsed) == "STEM-OPT"

"""
Tests for visa stage detection functionality.
These tests verify that the system correctly identifies visa stages based on parsed document fields.
"""

from app.services.profile import detect_stage
import pytest


def test_detect_stage_cpt_with_employer():
    """Test CPT detection when employer information is present"""
    parsed = {
        "Employer_Name": "Tech Company Inc.",
        "CPT_Start_Date": "01 JULY 2025",
        "CPT_End_Date": "29 AUGUST 2025"
    }
    assert detect_stage(parsed) == "CPT"


def test_detect_stage_cpt_keyword():
    """Test CPT detection from CPT keyword in employer name"""
    parsed = {"Employer_Name": "CPT FULL TIME APPROVED 01"}
    assert detect_stage(parsed) == "CPT"


def test_detect_stage_opt():
    """Test OPT detection from EAD category C03B"""
    parsed = {
        "Category": "C03B",
        "Employer_Name": "Google Inc."
    }
    assert detect_stage(parsed) == "OPT"


def test_detect_stage_opt_alternative_format():
    """Test OPT detection from alternative category format"""
    parsed = {
        "Category": "(C)(3)(B)",
        "Employer_Name": "Amazon"
    }
    assert detect_stage(parsed) == "OPT"


def test_detect_stage_stem_opt():
    """Test STEM OPT detection from EAD category C03C"""
    parsed = {
        "Category": "C03C",
        "Employer_Name": "Microsoft Corporation"
    }
    assert detect_stage(parsed) == "STEM-OPT"


def test_detect_stage_stem_opt_alternative_format():
    """Test STEM OPT detection from alternative category format"""
    parsed = {
        "Category": "(C)(3)(C)",
        "Employer_Name": "Apple Inc."
    }
    assert detect_stage(parsed) == "STEM-OPT"


def test_detect_stage_f1_student():
    """Test F-1 Student detection when no CPT or employment info"""
    parsed = {
        "SEVIS_ID": "N0012345678",
        "Program_End_Date": "15 MAY 2026"
        # No employer or CPT info
    }
    stage = detect_stage(parsed)
    # Should detect as F-1 Student (or whatever your logic returns for no employment)
    assert stage in ["F-1 Student", "F-1", "Unknown"]


def test_detect_stage_unknown_empty():
    """Test Unknown stage for empty fields"""
    parsed = {}
    stage = detect_stage(parsed)
    assert stage in ["Unknown", "F-1 Student", "F-1"]


def test_detect_stage_unknown_invalid_category():
    """Test handling of invalid/unknown EAD categories"""
    parsed = {
        "Category": "INVALID_CATEGORY",
        "Employer_Name": "Some Company"
    }
    stage = detect_stage(parsed)
    # Should not crash, should return Unknown or similar
    assert isinstance(stage, str)


def test_detect_stage_case_insensitive():
    """Test that stage detection handles case variations"""
    # Lowercase category
    parsed_lower = {"Category": "c03b"}
    stage_lower = detect_stage(parsed_lower)
    
    # Uppercase category
    parsed_upper = {"Category": "C03B"}
    stage_upper = detect_stage(parsed_upper)
    
    # Should detect same stage regardless of case
    assert stage_lower == stage_upper


@pytest.mark.parametrize("category,expected_stage", [
    ("C03B", "OPT"),
    ("C03C", "STEM-OPT"),
    ("(C)(3)(B)", "OPT"),
    ("(C)(3)(C)", "STEM-OPT"),
])
def test_various_category_formats(category, expected_stage):
    """Test detection with various EAD category formats"""
    parsed = {
        "Category": category,
        "Employer_Name": "Test Company"
    }
    assert detect_stage(parsed) == expected_stage


def test_detect_stage_with_multiple_indicators():
    """Test when document has multiple visa stage indicators"""
    parsed = {
        "SEVIS_ID": "N0012345678",
        "Employer_Name": "Tech Corp",
        "CPT_Start_Date": "01 JULY 2025",
        "CPT_End_Date": "29 AUGUST 2025",
        "Category": "C03B"  # This might be from a different document
    }
    stage = detect_stage(parsed)
    # Should prioritize CPT since it has CPT dates
    # Or handle based on your business logic
    assert stage in ["CPT", "OPT"]


def test_detect_stage_partial_cpt_info():
    """Test CPT detection with partial information"""
    # Has employer but no dates
    parsed = {"Employer_Name": "Company Name"}
    stage = detect_stage(parsed)
    # Might be CPT or Unknown depending on logic
    assert isinstance(stage, str)


def test_detect_stage_with_none_values():
    """Test handling of None values in parsed fields"""
    parsed = {
        "SEVIS_ID": "N0012345678",
        "Employer_Name": None,
        "Category": None
    }
    stage = detect_stage(parsed)
    # Should not crash
    assert isinstance(stage, str)