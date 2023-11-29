from fastapi import APIRouter
from typing import Union
import requests
from bs4 import BeautifulSoup
import re

router = APIRouter()

Base_URL = "https://www.townofbarnstable.us/Departments/Assessing/Property_Values/"


@router.get("/properties")
def getProperties(propertyAddress: Union[str, None] = None):
    properties = []
    page = 0

    while True:
        url = f"https://www.townofbarnstable.us/Departments/Assessing/Property_Values/Property-Look-Up.asp?type=3&searching=yes&searchtype=address&mappar=&ownname=&streetno=&streetname={propertyAddress}&Start={page}"
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
            property["details_link"] = Base_URL + columns[5].find("a")["href"].strip()
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
    firstName: Union[str, None] = None,
    lastName: Union[str, None] = None,
    town: Union[str, None] = None,
):
    towns = [
        "Barnstable",
        "Bourne",
        "Brewster",
        "Chatham",
        "County",
        "Dennis",
        "Eastham",
        "Falmouth",
        "Harwich",
        "Mashpee",
        "Orleans",
        "Provincetown",
        "Sandwich",
        "Truro",
        "Various",
        "Wellfleet",
        "Yarmouth",
    ]
    for town in towns:
        print(town)

    response = requests.get(
        f"https://search.barnstabledeeds.org/ALIS/WW400R.HTM?W9SNM={lastName}&W9GNM={firstName}&W9IXTP=A&W9ABR=DD&W9TOWN={town}&W9INQ=AY&W9FDTA=&W9TDTA=&AYVAL=+1742&CYVAL=2015&WSHTNM=WW401R00&WSIQTP=LR01LP&WSKYCD=N&WSWVER=2&W9INQ=#schTerms"
    )
    soup = BeautifulSoup(response.text, "html.parser")