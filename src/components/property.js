import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sessionStorage as storage } from "js-storage";
import Header from "./header";

const Property = () => {
  const { search } = useLocation();
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const details_url = search.match(urlRegex);
  const property_id = new URL(window.location.href).searchParams.get(
    "property_id"
  );

  const [loaded, setLoaded] = useState(!!storage.get(property_id));
  const [property, setProperty] = useState(
    storage.get(property_id) || { sales_history: [] }
  );

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

  const handleGetDeeds = () => {
    axios
      .get("/api/deeds", {
        params: {
          lastName: property.owner,
          deed_date: property.sales_history[0].sale_date,
        },
      })
      .then(({ data }) => {
        console.log(data);
      });
  };

  return (
    <>
      <Header />
      {loaded ? (
        <div className="container mx-auto mt-10">
          <div className="mt-6 shadow-xl p-5">
            <div className="px-4 sm:px-0 flex">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900 underline flex-1 cursor-pointer">
                Property Information
              </h3>
              <button
                type="submit"
                className="block rounded-md bg-gray-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Report
              </button>
            </div>
            <div className="mt-3 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Report Card
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">
                      <a target="_blank" href={property.record_card_link}>
                        <img
                          src="https://www.townofbarnstable.us/Departments/Assessing/Property_Values/propcard.png"
                          alt="Report Card"
                        />
                      </a>
                    </span>
                  </dd>
                </div>
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Address
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.address}</span>
                  </dd>
                </div>
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Parcel
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.parcel}</span>
                  </dd>
                </div>
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Owner Name
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.owner}</span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-gray-600 hover:text-gray-500"
                        onClick={handleGetDeeds}
                      >
                        Deeds
                      </button>
                    </span>
                  </dd>
                </div>
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Owner Address
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.owner_address}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-6 shadow-xl p-5">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900 underline cursor-pointer">
                Total and most recent assessed value of property
              </h3>
            </div>
            <div className="mt-3 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Value
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.assessed_value}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-6 shadow-xl p-5">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900 underline cursor-pointer">
                Total and most recent tax Information
              </h3>
            </div>
            <div className="mt-3 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Value
                  </dt>
                  <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <span className="flex-grow">{property.tax}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-6 shadow-xl p-5">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl font-semibold leading-7 text-gray-900 underline cursor-pointer">
                Sales history
              </h3>
            </div>
            <div className="mt-3 border-t border-gray-100">
              <table className="w-full">
                <thead>
                  <tr>
                    {Object.keys(property.sales_history[0]).map((header) => (
                      <th
                        className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        key={header}
                      >
                        {header.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {property.sales_history.map(
                    ({ owner, sale_date, book_page, sale_price }, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-300">
                          {owner}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-300">
                          {sale_date}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-300">
                          {book_page}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-300">
                          {sale_price}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
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
