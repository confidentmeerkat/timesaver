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
      storage.removeAll();
      storage.set({ name, email, propertyAddress });
      buyerInfoHandler({ name, email, propertyAddress });
      axios
        .get("/api/properties", { params: { propertyAddress } })
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
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          TimeSave
        </h2>
        {/* {validationFailed && (
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Aute magna irure deserunt veniam aliqua magna enim voluptate.
          </p>
        )} */}
      </div>
      <form
        className="mx-auto mt-16 max-w-xl sm:mt-20"
        onSubmit={handleSearchProperty}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={name}
                onChange={handleChange(setName)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Mailing address
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="property-address"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Property Address
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="property-address"
                id="property-address"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={propertyAddress}
                onChange={handleChange(setPropertyAddress)}
              />
            </div>
          </div>
          {validationFailed && (
            <p className="text-red-600 text-xs italic">
              Please input above values correctly.
            </p>
          )}
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {!loading ? (
              "Lookup properties"
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
        </div>
      </form>
    </div>
  );
};

export default Home;
