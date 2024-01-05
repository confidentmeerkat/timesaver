import React from "react";
import { sessionStorage as storage } from "js-storage";
import { propertyTemplate } from "./property_template";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import "./style.css";

const urlRegex = /(https?:\/\/[^\s]+)/g;

const Report = () => {
  const { search } = useLocation();
  const details_url = search.match(urlRegex);
  const property_id = new URL(window.location.href).searchParams.get(
    "property_id"
  );

  const image = storage.get(property_id)?.map_link || "";
  const property = storage.get(property_id) || { sales_history: [] };
  const deed = {
    ...(storage.get(property_id)?.deed || {}),
    deed_date: storage.get(property_id)?.sales_history[0].sale_date || "",
  };

  const handleDownloadAsHTML = () => {
    const htmlContent = propertyTemplate({
      image,
      property_info: property,
      deed_info: deed,
    });

    const blob = new Blob([htmlContent], { type: "text/html" });
    const fileName = property.address;
    saveAs(blob, fileName);
  };

  const navigate = useNavigate();
  const handleBackToPropertyPage = () => {
    navigate(`/property?property_id=${property_id}&details_url=${details_url}`);
  };

  return (
    <div className="box-container bg-[#F8F8F8]">
      <div className="flex items-center">
        <div className="flex-grow">
          <button
            type="submit"
            className="block rounded-md bg-gray-900 mb-5 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleBackToPropertyPage}
          >
            Back to property page
          </button>
        </div>
        {/* <button
          type="submit"
          className="block rounded-md mr-5 bg-gray-900 mb-5 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          PDF
        </button> */}
        <button
          type="submit"
          className="block rounded-md bg-gray-900 mb-5 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleDownloadAsHTML}
        >
          HTML
        </button>
      </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-2">
          <div>
            <img src={image} alt="property image" style={{ width: "100%" }} />
          </div>
          <div>
            <p className="mt-2 mb-3 text-xl font-bold">Propery Information</p>
            <div className="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400">
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Report Card</p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={property.record_card_link}
                >
                  <img
                    src="https://www.townofbarnstable.us/Departments/Assessing/Property_Values/propcard.png"
                    alt="Report Card"
                  />
                </a>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Address</p>
                <p className="col-span-5 pb-[2px]">{property.address}</p>
              </div>

              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Parcel</p>
                <p className="col-span-5 pb-[2px]">{property.parcel}</p>
              </div>

              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Owner Name</p>
                <p className="col-span-5 pb-[2px]">{property.owner}</p>
              </div>

              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Owner Address</p>
                <p className="col-span-5 pb-[2px]">{property.owner_address}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mt-2 mb-3 text-xl font-bold">
              Total and most recent assessed value of property
            </p>
            <div className="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400">
              <p className="col-span-3 font-[500] pb-[2px]">
                {property.assessed_value}
              </p>
            </div>
          </div>

          <div>
            <p className="mt-2 mb-3 text-xl font-bold">
              Total and most recent tax information
            </p>
            <div className="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400">
              <p className="col-span-3 font-[500] pb-[2px]">{property.tax}</p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="border border-solid border-gray-300">
            <div className="p-4 pb-2 text-center border border-solid border-gray-300 text-gray-900 font-bold">
              Sales History
            </div>
            <div className="p-2">
              <div className="grid grid-cols-12 font-[500] border-solid border-b-[2px]">
                <div className="col-span-5 pl-2">Owner</div>
                <div className="col-span-2 pl-2">Sale_Date</div>
                <div className="col-span-2 pl-2">Book_page</div>
                <div className="col-span-3 pl-2">Sale Price</div>
              </div>

              <div className="grid grid-cols-12 py-1 border-solid border-b-[1px]">
                {property.sales_history.map(
                  ({ owner, sale_date, book_page, sale_price }, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-5">{owner}</div>
                      <div className="col-span-2">{sale_date}</div>
                      <div className="col-span-2">{book_page}</div>
                      <div className="col-span-3">{sale_price}</div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border border-solid border-gray-300 mt-5">
            <div className="p-4 pb-2 text-center border border-solid border-gray-300 text-gray-900 font-bold">
              Deed
            </div>
            <div className="p-2 text-center">
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">PDF</p>
                <div className="col-span-5">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={deed.deed_url}
                    className="flex justify-center"
                  >
                    <img
                      alt="deed_pdf"
                      width="30"
                      height="30"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT6e_7m1x2QVNQ3IoIdmzv0mcoCKhRUyhG4182nUNLYRhPgW5MufGgl_zffZ3Aw5b5-Sc&s"
                    ></img>
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Book-Page</p>
                <p className="col-span-5 pb-[2px]">{deed.deed_page}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Seller</p>
                <p className="col-span-5 pb-[2px]">{deed.seller}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Buyer</p>
                <p className="col-span-5 pb-[2px]">{deed.buyer}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Sale Price</p>
                <p className="col-span-5 pb-[2px]">{deed.sale_price}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">Deed of Date</p>
                <p className="col-span-5 pb-[2px]">{deed.deed_date}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">
                  Land Description
                </p>
                <p className="col-span-5 pb-[2px]">{deed.land_description}</p>
              </div>
              <div className="grid grid-cols-8 pb-3 gap-5">
                <p className="col-span-3 font-[500] pb-[2px]">
                  Other Covenants
                </p>
                <p className="col-span-5 pb-[2px]">{deed.other_covenants}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
