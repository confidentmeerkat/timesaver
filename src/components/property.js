import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sessionStorage as storage } from "js-storage";

const Property = () => {
  const { search } = useLocation();
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const details_url = search.match(urlRegex);
  const property_id = new URL(window.location.href).searchParams.get(
    "property_id"
  );

  const [loaded, setLoaded] = useState(!!storage.get(property_id));
  const [property, setProperty] = useState(storage.get(property_id));

  useEffect(() => {
    if (!loaded)
      axios
        .get("/api/property", { params: { url: details_url[0] } })
        .then(({ data }) => {
          setLoaded(true);
          storage.set({ [property_id]: data });
          setProperty(data);
        });
  }, [details_url]);

  const navigate = useNavigate();

  const handleResearch = () => {
    navigate("/");
    storage.removeAll();
  };

  const handleBack = () => {
    navigate("/properties");
  };

  return (
    <>
      {loaded ? (
        <div className="container mx-auto">
          <div className="mt-10">
            <div className="mt-10 flex justify-between">
              <a
                target="_blank"
                className="text-3xl underline text-blue-500 flex-1"
                href={property.record_card_link}
                rel="noreferrer"
              >
                Record Card
              </a>
              <button
                className="bg-white text-blue-800 font-semibold py-2 px-4 border border-gray-400 rounded shadows hover:bg-gray-100D mr-2"
                onClick={handleResearch}
              >
                Research
              </button>
              <button
                className="bg-white text-blue-800 font-semibold py-2 px-4 border border-gray-400 rounded shadows hover:bg-gray-100D mr-2"
                onClick={handleBack}
              >
                Back
              </button>
              <button className="bg-white text-blue-800 font-semibold py-2 px-4 border border-gray-400 rounded shadows hover:bg-gray-100D mr-2">
                Report
              </button>
            </div>
            <div className="grid grid-cols-8 gap-4">
              <div className="col-start-1 col-span-8">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-5" colSpan={2}>
                        <h1 className="text-3xl underline">Main Information</h1>
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top">
                        <h1 className="text-xl">
                          Property Address: {property.address}
                        </h1>
                      </td>
                      <td className="align-top">
                        <h1 className="text-xl">
                          Property Parcel: {property.parcel}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top">
                        <h1 className="text-xl">
                          Owner Name: {property.owner}
                        </h1>
                      </td>
                      <td className="align-top">
                        <h1 className="text-xl">
                          Owner Address: {property.owner_address}
                        </h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-start-1 col-end-8">
                <div className="mt-10 flex items-end">
                  <h1 className="text-3xl underline">
                    Total and most recent tax
                  </h1>
                  <div className="ml-8 text-2xl">{property.tax}</div>
                </div>
              </div>
              <div className="col-start-1 col-end-8">
                <div className="mt-10 flex items-end">
                  <h1 className="text-3xl underline">
                    Total and most assessed value
                  </h1>
                  <div className="ml-8 text-2xl">{property.assessed_value}</div>
                </div>
              </div>
              <div className="col-start-1 col-end-8">
                <div className="mt-10">
                  <h1 className="text-3xl mb-10 underline">Sales History</h1>
                  <table className="w-full">
                    <thead>
                      <tr>
                        {Object.keys(property.sales_history[0]).map(
                          (header) => (
                            <th key={header}>{header.toUpperCase()}</th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {property.sales_history.map(
                        (
                          { owner, sale_date, book_page, sale_price },
                          index
                        ) => (
                          <tr key={index}>
                            <td className="text-center">{owner}</td>
                            <td className="text-center">{sale_date}</td>
                            <td className="text-center">{book_page}</td>
                            <td className="text-center">{sale_price}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Property;
