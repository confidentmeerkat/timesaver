import { useContext } from "react";
import { BuyerInfoContext, PropertyContext } from "../App";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import { sessionStorage as storage } from "js-storage";

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
    <>
      <Header />
      <div className="container mx-auto mt-10">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                Location
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                Owner
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                Parcel
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]"></th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]"></th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                Details
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                Viewed
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.map(
              (
                { parcel, location, owner, extra_1, extra_2, details_link },
                index
              ) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[5%]">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[20%]">
                    {location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[20%]">
                    {owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[10%]">
                    {parcel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[10%]">
                    {extra_1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[10%]">
                    {extra_2}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[15%]">
                    <button
                      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                      onClick={handleShowDetail(details_link, index)}
                    >
                      Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-[10%]">
                    {storage.get(index) && (
                      <svg
                        fill="#000000"
                        version="1.1"
                        id="Capa_1"
                        width="45px"
                        height="45px"
                        viewBox="0 0 442.04 442.04"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g>
                            <g>
                              <path d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203 c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219 c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367 c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021 c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212 c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071 c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z"></path>
                            </g>
                            <g>
                              <path d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188 c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993 c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5 s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z"></path>
                            </g>
                            <g>
                              <path d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Properties;
