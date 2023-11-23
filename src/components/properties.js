import { useContext } from "react";
import { BuyerInfoContext, PropertyContext } from "../App";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const { value: properties } = useContext(PropertyContext);
  const {
    value: { name = "", email = "", propertyAddress = "" },
  } = useContext(BuyerInfoContext);

  const navigate = useNavigate();
  const handleShowDetail = (propertyUrl, index) => () => {
    navigate(`/property?property_id=${index}&details_url=${propertyUrl}`);
  };

  return (
    <div className="container mx-auto">
      <div className="flex mt-10 mb-10 justify-around">
        <div className="">Buyer Name: {name}</div>
        <div className="">Mailing Address: {email}</div>
        <div className="">Address Keyword: {propertyAddress}</div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full border text-center text-sm font-light">
                <thead className="border-b font-medium">
                  <tr>
                    <th scope="col" className="border-r px-6 py-4 w-1/12">
                      ID
                    </th>
                    <th scope="col" className="border-r px-6 py-4 w-1/12">
                      Parcel
                    </th>
                    <th scope="col" className="border-r px-6 py-4 w-1/12">
                      Location
                    </th>
                    <th scope="col" className="border-r px-6 py-4 w-1/12">
                      Owner
                    </th>
                    <th scope="col" className="border-r px-6 py-4"></th>
                    <th scope="col" className="border-r px-6 py-4"></th>
                    <th scope="col" className="px-6 py-4">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(
                    (
                      {
                        parcel,
                        location,
                        owner,
                        extra_1,
                        extra_2,
                        details_link,
                      },
                      index
                    ) => (
                      <tr className="border-b" key={index}>
                        <td className="whitespace-nowrap border-r px-6 py-4">
                          {index}
                        </td>
                        <td className="whitespace-nowrap border-r px-6 py-4">
                          {parcel}
                        </td>
                        <td className="whitespace-nowrap border-r px-6 py-4">
                          {location}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 border-r">
                          {owner}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 border-r">
                          {extra_1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 border-r">
                          {extra_2}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                            onClick={handleShowDetail(details_link, index)}
                          >
                            Details
                          </button>
                        </td>
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
  );
};

export default Properties;
