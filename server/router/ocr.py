import pytesseract
from pdf2image import convert_from_path
from os import path

pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def pdf2img(filename):
    return convert_from_path(filename)


def parse_pdf_file(filename):
    while True:
        try:
            images = pdf2img(filename)
            return ocr(images[0]) + "\n" + ocr(images[1])
        except Exception as e:
            print(str(e))


def ocr(img):
    return pytesseract.image_to_string(img)


def main(pdf):
    return parse_pdf_file(pdf)
