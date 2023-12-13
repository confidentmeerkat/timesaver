import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

const DeedModal = ({ open, onClose, name, date }) => {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("/api/deeds", {
        params: {
          ownername: name,
          deed_date: date,
        },
      })
      .then(({ data }) => {
        setLoaded(true);
        setData(data);
      });
  }, [name, date]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative min-w-[400px] min-h-[200px] transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                {loaded ? (
                  data.deeds_count === 0 ? (
                    <p className="text-2xl">
                      There are no deeds in this owner's name.
                    </p>
                  ) : (
                    <>
                      <div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Deed
                          </Dialog.Title>
                          <dl className="divide-y divide-gray-100">
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                PDF
                              </dt>
                              <dd className="mt-1 flex justify-center text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={data.deed_url}
                                >
                                  <img
                                    width={50}
                                    height={50}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT6e_7m1x2QVNQ3IoIdmzv0mcoCKhRUyhG4182nUNLYRhPgW5MufGgl_zffZ3Aw5b5-Sc&s"
                                  ></img>
                                </a>
                              </dd>
                            </div>
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                Seller
                              </dt>
                              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">{data.seller}</span>
                              </dd>
                            </div>
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                Buyer
                              </dt>
                              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">{data.buyer}</span>
                              </dd>
                            </div>
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                Sale Price
                              </dt>
                              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                  {data.sale_price}
                                </span>
                              </dd>
                            </div>
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                Date of Deed
                              </dt>
                              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">{date}</span>
                              </dd>
                            </div>
                            <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6 text-gray-900">
                                Land Description
                              </dt>
                              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                  {data.land_description}
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                          onClick={onClose}
                        >
                          Go back to dashboard
                        </button>
                      </div>
                    </>
                  )
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeedModal;
