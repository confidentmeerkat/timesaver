import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BuyerInfoContext, PropertyContext } from "../App";
import { useNavigate } from "react-router-dom";
import { sessionStorage as storage } from "js-storage";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [validationFailed, setValidationFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (cb) => (e) => {
    cb(e.target.value);
  };

  const { handler: propertiesHanlder } = useContext(PropertyContext);
  const { handler: buyerInfoHandler } = useContext(BuyerInfoContext);

  useEffect(() => {}, []);

  const navigate = useNavigate();
  const handleSearchProperty = (e) => {
    e.preventDefault();
    if (name && email && propertyAddress) {
      setLoading(true);
      setValidationFailed(false);
      storage.set({ name, email, propertyAddress });
      buyerInfoHandler({ name, email, propertyAddress });
      axios
        .get("/properties", { params: { propertyAddress } })
        .then(({ data }) => {
          navigate("/properties");
          storage.set({ properties: JSON.stringify(data) });
          propertiesHanlder(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else setValidationFailed(true);
  };

  return (
    <div className="flex justify-center mt-40">
      <form className="w-full max-w-lg mt-5" onSubmit={handleSearchProperty}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-name"
            >
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500"
              id="grid-name"
              type="text"
              placeholder="Jane"
              value={name}
              onChange={handleChange(setName)}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-email"
            >
              Mailing Address
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
              id="grid-email"
              type="text"
              placeholder="jhon@example.com"
              value={email}
              onChange={handleChange(setEmail)}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-keyword"
            >
              Property Address
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500"
              placeholder="FALMOUTH ROAD/RTE 28"
              value={propertyAddress}
              onChange={handleChange(setPropertyAddress)}
            />
            {loading && (
              <p className="text-gray-600 text-xs italic">
                It may take some time, so please be patient...
              </p>
            )}
            {validationFailed && (
              <p className="text-red-600 text-xs italic">
                Please input above values correctly.
              </p>
            )}
          </div>
        </div>

        <button
          className={`bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full ${
            loading
              ? "cursor-not-allowed opacity-50 hover:none"
              : "hover:bg-gray-100"
          } `}
          disabled={loading}
        >
          {!loading ? (
            "Look up Property"
          ) : (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
              Loading Properties...
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Home;
