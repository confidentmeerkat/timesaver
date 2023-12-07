import pytesseract
from pdf2image import convert_from_path
from os import path

# pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def pdf2img(filename):
    return convert_from_path(filename)


def parse_pdf_file(filename):
    try:
        page_txt = []
        images = pdf2img(filename)
        for index, img in enumerate(images):
            if index == 0:
                first_page_text = ocr(img)
                page_txt.append(first_page_text)
            else:
                page_txt.append(ocr(img))
        whole_text = "\n\n".join(page_txt)
        return first_page_text, whole_text
    except Exception as e:
        print(str(e))
        return None


def ocr(img):
    return pytesseract.image_to_string(img)


def main(pdf):
    return parse_pdf_file(pdf)
