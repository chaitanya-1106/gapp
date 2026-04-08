import PyPDF2
with open("Presentation Format for content.pdf", "rb") as file:
    reader = PyPDF2.PdfReader(file)
    for i in range(len(reader.pages)):
        print(reader.pages[i].extract_text())
