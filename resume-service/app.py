from flask import Flask, jsonify, request
from flask_cors import CORS
from pypdf import PdfReader

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB limit


@app.errorhandler(413)
def too_large(_):
    return jsonify(error="The file is too large. Maximum size is 5 MB."), 413


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/parse")
def parse():
    file = request.files.get("file")
    if file is None or file.filename == "":
        return jsonify(error="Please choose a PDF file."), 400
    if not file.filename.lower().endswith(".pdf"):
        return jsonify(error="Only PDF files are supported."), 400
    try:
        reader = PdfReader(file.stream)
        pages = [(page.extract_text() or "") for page in reader.pages]
    except Exception:
        return jsonify(error="Could not read this PDF. Try another file."), 400
    text = "\n".join(pages).strip()
    if not text:
        return jsonify(error="No text found. The PDF may be a scanned image."), 422
    return jsonify(text=text, pages=len(pages), characters=len(text))


if __name__ == "__main__":
    app.run(port=5000, debug=True)
    