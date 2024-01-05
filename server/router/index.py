from fastapi import APIRouter, Request, Depends
from typing import Union
from bs4 import BeautifulSoup
from datetime import datetime
import secrets
from server.router.ocr import main as ocr
from server.router.chatgpt import main as chatgpt
from server.db.database import get_db
from sqlalchemy.orm import Session
from server.db.models.Creteria import create as create_createria
import re, os, difflib, requests

router = APIRouter(prefix="/api")

TownOfBarnStable_Base_URL = (
    "https://www.townofbarnstable.us/Departments/Assessing/Property_Values/"
)
SearchBarnstable_Base_URL = "https://search.barnstabledeeds.org/"


@router.get("/properties")
def getProperties(
    street: Union[str, None] = None,
    streetNum: Union[str, None] = None,
    city: Union[str, None] = None,
    state: Union[str, None] = None,
    db: Session = Depends(get_db),
):
    # create_createria(db, street, streetNum, city, state)
    properties = []
    page = 0

    while True:
        url = f"https://www.townofbarnstable.us/Departments/Assessing/Property_Values/Property-Look-Up.asp?type=3&searching=yes&searchtype=address&mappar=&ownname=&streetno={streetNum}&streetname={street}&Start={page}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table", {"class": "parcelsearch"})
        rows = table.find_all("tr")

        for row in rows[1:41]:
            columns = row.find_all("td")
            property = {}
            property["parcel"] = columns[0].text.strip()
            property["location"] = columns[1].text.strip()
            property["owner"] = columns[2].text.strip()
            property["extra_1"] = columns[3].text.strip()
            property["extra_2"] = columns[4].text.strip()
            property["details_link"] = (
                TownOfBarnStable_Base_URL + columns[5].find("a")["href"].strip()
            )
            properties.append(property)

        if len(rows) <= 1:
            break
        else:
            page += 40
    return properties


@router.get("/property")
def getProperty(url: Union[str, None] = None):
    def get_map(map_url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        map_link = soup.find("img", src=lambda src: src and "propertyimages" in src)
        if map_link:
            return map_link["src"]
        return None

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    property = {}

    # record card
    record_card_link = soup.find(
        "a", href=lambda href: href and "PropertyRecordCards" in href
    )["href"].strip()
    gis_link = soup.find("a", text="GIS MAPS")["href"]
    property["record_card_link"] = record_card_link
    property["map_link"] = get_map(gis_link)

    # onwer information
    owner_info = soup.find("div", {"id": "accordion"}).find_all("div")[0].text
    map_block_lot = re.search(r"Map/Block/Lot:\s+(.*)", owner_info).group(1).strip()
    property["parcel"] = map_block_lot
    property_address1 = (
        re.search(r"Property Address\n.*\n(.*)", owner_info).group(1).strip()
    )
    property_address2 = (
        re.search(r"Property Address\n.*\n.*\n.*\n(.*)", owner_info).group(1).strip()
    )
    property_address = property_address1 + ", " + property_address2
    property["address"] = property_address
    owner_name = (
        re.search(r"Owner Name as of 1/1/24:\n.*\n(.*)", owner_info).group(1).strip()
    )
    property["owner"] = owner_name
    owner_address1 = (
        re.search(r"Owner Name as of 1/1/24:\n.*\n.*\n.*\n(.*)", owner_info)
        .group(1)
        .strip()
    )
    owner_address2 = (
        re.search(r"Owner Name as of 1/1/24:\n.*\n.*\n.*\n.*\n.*\n(.*)", owner_info)
        .group(1)
        .strip()
    )
    owner_address = owner_address1 + " " + owner_address2
    property["owner_address"] = owner_address

    # assessed value
    property["assessed_value"] = (
        soup.find("div", {"id": "collapseTwo"})
        .find("table")
        .find_all("tr")[5]
        .find_all("td")[1]
        .text
    )

    # tax info
    tax_info = (
        soup.find("div", {"id": "collapseThree"})
        .find("table")
        .find_all("tr")[0]
        .find_all("td")[0]
        .find("b", string=lambda text: text and "Total" in text)
    )
    property["tax"] = tax_info.text.split("Total:")[1].strip()

    # sales history
    property["sales_history"] = []
    history_keys = ["owner", "sale_date", "book_page", "sale_price"]
    table = soup.find("div", {"id": "collapseFour"}).find("table")
    rows = table.find_all("tr")
    for row in rows[1:]:
        columns = row.find_all("td")
        history = {}
        for i in range(0, 4):
            history[history_keys[i]] = columns[i].text.strip()
        property["sales_history"].append(history)

    return property


@router.get("/deeds")
def getDeeds(
    request: Request,
    ownername: Union[str, None] = None,
    deed_date: Union[str, None] = None,
    book: Union[str, None] = None,
    page: Union[str, None] = None,
):
    def get_records_table(url):
        response = requests.get(url)

        soup = BeautifulSoup(response.text, "html.parser")
        records_table = (
            soup.find("form", {"id": "search"})
            .find("div", {"class": "mainContent"})
            .find("table", recursive=False)
        )

        return records_table

    def get_deeds_from_table(table, date):
        results = []
        for tr in table.find_all("tr")[1:]:
            try:
                date_recvd = tr.find_all("td")[3].text
            except:
                break
            if datetime.strptime(date_recvd, "%m-%d-%Y").strftime("%Y-%m-%d") == date:
                deed_url = tr.find_all("td")[8].find("a")["href"]
                deed_page = tr.find_all("td")[6].text
                if deed_url not in results:
                    results.append(SearchBarnstable_Base_URL + deed_url[1:])
        return deed_page, results

    deeds_urls = []
    deed_page = ""
    ocred_result = {}

    if page is None:
        if ", " in ownername:
            lastName = ownername.split(", ")[0]
            firstName = ownername.split(", ")[1].split(" ")[0]
        else:
            words = ownername.split(" ")
            if words[len(words) - 1] == "LP":
                words.pop()
                lastName = " ".join(words)
            else:
                lastName = ownername[:28]
            firstName = ""

        registry_records_table = get_records_table(
            f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9SNM={lastName}&W9GNM={firstName}&W9IXTP=A&W9ABR=DD&W9TOWN=*ALL&W9INQ=AY&W9FDTA={datetime.strptime(deed_date, '%Y-%m-%d').strftime('%m%d%Y')}&W9TDTA={datetime.strptime(deed_date, '%Y-%m-%d').strftime('%m%d%Y')}&AYVAL=+1742&CYVAL=2015&WSHTNM=WW401R00&WSIQTP=LR01LP&WSKYCD=N&WSWVER=2&W9INQ=#schTerms"
        )

        if len(registry_records_table.find_all("tr")) < 3:
            land_court_records = get_records_table(
                f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?WSIQTP=LC01L&WSKYCD=L&W9ABR=DD&W9FDTA={datetime.strptime(deed_date, '%Y-%m-%d').strftime('%m%d%Y')}&W9GN8={firstName}&W9GN8B=&W9INQ=&W9IXTP=A&W9IXTPB=&W9MBGP=LC&W9SN8={lastName}&W9SN8B=&W9TDTA={datetime.strptime(deed_date, '%Y-%m-%d').strftime('%m%d%Y')}&W9TOWN=*ALL&WSSRPP=30#schTerms"
            )
            if len(registry_records_table.find_all("tr")) > 2:
                deed_page, deeds_urls = get_deeds_from_table(
                    land_court_records, deed_date
                )
        else:
            deed_page, deeds_urls = get_deeds_from_table(
                registry_records_table, deed_date
            )
    else:
        response = requests.get(
            f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9BK={book}&W9PG={page}&WSHTNM=WW409R00&WSIQTP=LR09AP&WSKYCD=B&WSWVER=2#schTerms"
        )
        soup = BeautifulSoup(response.text, "html.parser")
        if (
            len(
                soup.find("form", {"id": "search"})
                .find("div", {"class": "mainContent"})
                .find("table", recursive=False)
                .find_all("tr")
            )
            > 2
        ):
            deeds_urls.append(
                SearchBarnstable_Base_URL
                + soup.find("form", {"id": "search"})
                .find("div", {"class": "mainContent"})
                .find("table", recursive=False)
                .find_all("tr")[1]
                .find_all("td")[0]
                .find("a")["href"]
            )
            ocred_result["deed_date"] = re.search(
                r"\d{2}-\d{2}-\d{4}",
                soup.find("form", {"id": "search"})
                .find("div", {"class": "mainContent"})
                .find("table", recursive=False)
                .find_all("tr")[1]
                .find_all("td")[0]
                .text,
            ).group()

    random_string = secrets.token_hex(16)
    if not os.path.exists("temp"):
        os.makedirs("temp", mode=0o777)

    if len(deeds_urls) > 0:
        response = requests.get(deeds_urls[0])
        soup = BeautifulSoup(response.text, "html.parser")
        pdf_url = soup.find("a", text="View the Image")["href"]
        response = requests.get(SearchBarnstable_Base_URL + pdf_url)
        with open(f"temp/{random_string}.pdf", "wb") as f:
            f.write(response.content)
        try:
            ocred_text = ocr(os.path.abspath(f"temp/{random_string}.pdf"))
            seller, buyer, sale_price, land_description, other_covenants, land_plan_book, land_plan_page, prior_deed_book, prior_deed_page = chatgpt(
                ocred_text
            )
            ocred_result["seller"] = seller
            ocred_result["buyer"] = buyer
            ocred_result["sale_price"] = sale_price
            ocred_result["land_description"] = land_description
            ocred_result["other_covenants"] = other_covenants
            ocred_result["land_plan_book"] = int(land_plan_book)
            ocred_result["land_plan_page"] = int(land_plan_page)
            ocred_result["prior_deed_book"] = int(prior_deed_book)
            ocred_result["prior_deed_page"] = int(prior_deed_page)
            ocred_result["deeds_count"] = len(deeds_urls)
            ocred_result["deed_url"] = SearchBarnstable_Base_URL + pdf_url
            ocred_result["deed_page"] = deed_page
            if land_plan_book is not None and land_plan_page is not None:
                response = requests.get(f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9PBK={land_plan_book}&W9PPG={land_plan_page}&W9PPG2=&WSHTNM=WW409P00&WSIQTP=RP09AP&WSKYCD=P&WSWVER=2&W9ABR=*RP&W9INQ=RP&W9MBGP=RP#schTerms")
                soup = BeautifulSoup(response.text, "html.parser")
                tr_els = soup.find("div", {"class": "mainContent"}).find("table").find_all("tr")
                if len(tr_els) > 3:
                    url = tr_els[1].find("td").find("a")["href"]
                    response = requests.get(url)
                    soup = BeautifulSoup(response.text, "html.parser")
                    land_plan_pdf_url = soup.find("a", text="View the Image")["href"]
                    ocred_result["land_plan_pdf_url"] = land_plan_pdf_url
        except Exception as e:
            print(e)
        finally:
            os.remove(f"temp/{random_string}.pdf")
    else:
        ocred_result["deeds_count"] = 0

    return ocred_result
