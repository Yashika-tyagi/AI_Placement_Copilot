from app.utils.pdf import extract_text_from_pdf


file_path = "uploads/Resumefinal.pdf"

text = extract_text_from_pdf(file_path)

print("========== RESUME TEXT ==========")
print(text)
print("=================================")