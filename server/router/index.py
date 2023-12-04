from fastapi import APIRouter
from typing import Union
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

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
):
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
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    property = {}

    # record card
    record_card_link = soup.find(
        "a", href=lambda href: href and "PropertyRecordCards" in href
    )["href"].strip()
    property["record_card_link"] = record_card_link

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
        re.search(r"Owner Name as of 1/1/23:\n.*\n(.*)", owner_info).group(1).strip()
    )
    property["owner"] = owner_name
    owner_address1 = (
        re.search(r"Owner Name as of 1/1/23:\n.*\n.*\n.*\n(.*)", owner_info)
        .group(1)
        .strip()
    )
    owner_address2 = (
        re.search(r"Owner Name as of 1/1/23:\n.*\n.*\n.*\n.*\n.*\n(.*)", owner_info)
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
    lastName: Union[str, None] = None,
    deed_date: Union[str, None] = None,
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
                if deed_url not in results:
                    results.append(SearchBarnstable_Base_URL + deed_url[1:])
        return results

    def ocr_space_file(filename, overlay=False, api_key="helloworld", language="eng"):
        payload = {
            "url": "https://search.barnstabledeeds.org/WwwImg/DGLG.PDF",
            "isOverlayRequired": overlay,
            "apikey": api_key,
            "language": language,
            "OCREngine": 1,
        }
        r = requests.post(
            "https://api.ocr.space/parse/image",
            data=payload,
        )
        return r.content.decode()

    deeds_urls = []
    registry_records_table = get_records_table(
        f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9SNM={lastName[:28]}&W9GNM=&W9IXTP=A&W9ABR=DD&W9TOWN=*ALL&W9INQ=AY&W9FDTA=&W9TDTA=&AYVAL=+1742&CYVAL=2015&WSHTNM=WW401R00&WSIQTP=LR01LP&WSKYCD=N&WSWVER=2&W9INQ=#schTerms"
    )
    if len(registry_records_table.find_all("tr")) < 3:
        land_court_records = get_records_table(
            f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9SN8={lastName[:28]}&W9GN8=&W9IXTP=A&W9SN8B=&W9GN8B=&W9IXTPB=+&W9ABR=DD&W9TOWN=*ALL&W9FDTA=&W9TDTA=&WSHTNM=WW401L00&WSIQTP=LC01LP&WSWVER=2#schTerms"
        )
        if len(registry_records_table.find_all("tr")) > 2:
            deeds_urls = get_deeds_from_table(land_court_records, deed_date)
    else:
        deeds_urls = get_deeds_from_table(registry_records_table, deed_date)

    ocr_result = ocr_space_file(
        filename="DVA2.PDF", overlay=False, api_key="K83055649588957"
    )

    return deeds_urls
