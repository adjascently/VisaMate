from app.services.retriever import add_documents

# Sample USCIS policy documents
test_docs = [
    """CPT (Curricular Practical Training) is temporary employment authorization for F-1 students. 
    It must be an integral part of the established curriculum. Students must have been enrolled 
    full-time for at least one academic year before becoming eligible for CPT. Students can work 
    part-time (20 hours or less per week) or full-time during annual vacation periods.""",
    
    """OPT (Optional Practical Training) allows F-1 students to work in the United States for up to 
    12 months after completing their degree. Students must apply for OPT before completing their program. 
    STEM degree holders may be eligible for a 24-month extension of their post-completion OPT, 
    allowing them to work for a total of up to 36 months.""",
    
    """To apply for CPT: 1) Secure a job offer or internship related to your major field of study. 
    2) Meet with your Designated School Official (DSO). 3) Have your DSO authorize CPT in SEVIS. 
    4) Receive an updated I-20 with CPT authorization. 5) Begin work only after receiving the 
    authorized I-20. Never start working before authorization.""",
    
    """STEM OPT Extension requirements: Must have degree in STEM field, employer must be E-Verify 
    enrolled, must complete Form I-983 training plan, submit application before current OPT expires, 
    maintain employment records, report to DSO every 6 months.""",
]

test_ids = [
    "uscis_cpt_001", 
    "uscis_opt_001", 
    "uscis_cpt_application_001",
    "uscis_stem_opt_001"
]

test_metadata = [
    {"source": "USCIS CPT Guidelines 2024"},
    {"source": "USCIS OPT Policy Manual"},
    {"source": "CPT Application Process Guide"},
    {"source": "STEM OPT Extension Requirements"}
]

print("Adding test documents to ChromaDB...")
add_documents(test_docs, test_ids, test_metadata)
print("Test documents added successfully!")

# Verify they were added
from app.services.retriever import collection
print(f"\n Total documents in collection: {collection.count()}")
print("\n Sample of what's stored:")
sample = collection.peek(limit=2)
if sample and sample.get('ids'):
    for i, doc_id in enumerate(sample['ids']):
        print(f"  - ID: {doc_id}")
        print(f"    Source: {sample['metadatas'][i].get('source', 'N/A')}")