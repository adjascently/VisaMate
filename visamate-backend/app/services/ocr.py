import pytesseract
from PIL import Image
import re
import io
from pdf2image import convert_from_bytes


def ocr_tesseract(file_bytes: bytes) -> str:
    """Run OCR on all pages of a PDF or an image and return extracted text."""
    text = ""

    if file_bytes[:4] == b"%PDF":
        # Convert PDF pages to images, then OCR each page
        pages = convert_from_bytes(file_bytes)
        page_texts = []
        for i, page in enumerate(pages, start=1):
            page_text = pytesseract.image_to_string(page)
            page_texts.append(page_text)
            print(f"🧾 OCR page {i} length: {len(page_text)}")
        text = "\n".join(page_texts)
    else:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)

    print("=" * 80)
    print("🧠 COMPLETE OCR TEXT OUTPUT:")
    print("=" * 80)
    print(text[:5000])  # print first 5K chars to avoid huge dumps
    print("=" * 80)

    return text


def detect_doc_type(text: str) -> str:
    """Detect document type based on unique keywords."""
    if re.search(r"(SEVIS|Form\s*I-20)", text, re.IGNORECASE):
        doc_type = "I-20"
    elif re.search(r"(EAD|Employment\s*Authorization)", text, re.IGNORECASE):
        doc_type = "EAD"
    elif re.search(r"(DS-2019|J-1)", text, re.IGNORECASE):
        doc_type = "DS-2019"
    else:
        doc_type = "Unknown"

    print(f"📑 Detected Document Type: {doc_type}")
    return doc_type


def parse_fields(doc_type: str, text: str) -> dict:
    """Extract SEVIS ID, Program Dates, Employer, etc. depending on doc type."""
    fields = {}

    if doc_type == "I-20":
        # --- SEVIS ID ---
        sevis = re.search(r"SEVIS\s*(?:ID|Number)?[:\s]*([A-Z0-9]{9,10})", text, re.IGNORECASE)

        # --- Program End Date ---
        end_date = re.search(
            r"Program\s*End(?:\s*Date)?[:\s]*([0-9]{1,2}\s+\w+\s+[0-9]{4})",
            text, re.IGNORECASE,
        )

        # --- CPT Dates ---
        cpt_dates = re.search(
            r"CPT\s+([0-9]{1,2}\s+\w+\s+[0-9]{4})\s*[-–]\s*([0-9]{1,2}\s+\w+\s+[0-9]{4})",
            text, re.IGNORECASE,
        )

        # --- EMPLOYER Extraction ---
        employer = None
        lines = [l.strip() for l in text.splitlines() if l.strip()]

        # Strategy 1: nearby "EMPLOYER"
        for i, line in enumerate(lines):
            if re.search(r"EMPLOYER", line, re.IGNORECASE):
                context = lines[i:i + 10]
                for j in context:
                    if (
                        re.search(r"[A-Za-z]", j)
                        and not re.search(
                            r"(EMPLOYER|INFORMATION|ADDRESS|PHONE|EMAIL|CITY|STATE|AUTHORIZATION|DATES|APPROVED)",
                            j, re.IGNORECASE,
                        )
                        and 1 <= len(j.split()) <= 10
                    ):
                        employer = j.strip()
                        break
            if employer:
                break

        # Fallbacks if no employer found
        if not employer and cpt_dates:
            match = re.search(r"([A-Z][A-Za-z0-9 ,.&'()-]{2,50})\s+\d{1,2}\s+\w+\s+\d{4}", text)
            if match:
                employer = match.group(1).strip()

        if not employer:
            match = re.search(r"(?:Employer\s*Name|Name)[:\s]+([A-Z][A-Za-z0-9 ,.&'()-]+)", text, re.IGNORECASE)
            if match:
                employer = match.group(1).split('\n')[0].strip()

        # Cleanup employer
        if employer:
            employer = re.sub(r'\s{2,}', ' ', employer)
            employer = re.split(r'\d{1,2}\s+\w+\s+\d{4}', employer)[0].strip()
            employer = re.split(r',[A-Z]{2}', employer)[0].strip('.,; ')
            print(f"🎯 FINAL Employer_Name: '{employer}'")
        else:
            print("⚠️ Employer_Name could not be extracted")

        # --- Final field set ---
        fields["SEVIS_ID"] = sevis.group(1) if sevis else None
        fields["Program_End_Date"] = end_date.group(1) if end_date else None
        fields["Employer_Name"] = employer
        if cpt_dates:
            fields["CPT_Start_Date"] = cpt_dates.group(1)
            fields["CPT_End_Date"] = cpt_dates.group(2)

        print("\n✅ EXTRACTED I-20 FIELDS:")
        for k, v in fields.items():
            print(f"  • {k}: {v}")

    elif doc_type == "EAD":
        category = re.search(r"Category[:\s]*([A-Z0-9()]+)", text, re.IGNORECASE)
        employer = re.search(r"Employer(?:\s*Name)?[:\s]*([A-Za-z0-9 ,.&'-]+)", text, re.IGNORECASE)

        fields["Category"] = category.group(1) if category else None
        fields["Employer_Name"] = employer.group(1).strip() if employer else None

        print("\n✅ EXTRACTED EAD FIELDS:")
        for k, v in fields.items():
            print(f"  • {k}: {v}")

    elif doc_type == "DS-2019":
        sevis = re.search(r"SEVIS\s*Number[:\s]*([A-Z0-9]+)", text, re.IGNORECASE)
        program = re.search(r"Program\s*Sponsor[:\s]*([A-Za-z0-9 ,.&'-]+)", text, re.IGNORECASE)

        fields["SEVIS_Number"] = sevis.group(1) if sevis else None
        fields["Program_Sponsor"] = program.group(1).strip() if program else None

        print("\n✅ EXTRACTED DS-2019 FIELDS:")
        for k, v in fields.items():
            print(f"  • {k}: {v}")

    else:
        print("⚠️ Unknown document type — returning raw OCR text only.")
        fields["raw_text"] = text[:1000]  # limit length

    return fields
