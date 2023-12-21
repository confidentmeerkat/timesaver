import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const BookPageModal = ({ open, onClose, onConfirm }) => {
  const [book, setBook] = useState("");
  const [page, setPage] = useState("");

  const handleChange = (cb) => (e) => {
    cb(e.target.value);
  };

  const handleSearchDeed = () => {
    if (book && page) {
      onClose();
      onConfirm(book, page);
    }
  };

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
              <Dialog.Panel className="relative min-w-[100px] min-h-[200px] transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="book"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Book
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="number"
                        name="book"
                        id="book"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={book}
                        onChange={handleChange(setBook)}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="page"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Page
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="number"
                        name="page"
                        id="page"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={page}
                        onChange={handleChange(setPage)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-4 block rounded-md bg-gray-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleSearchDeed}
                  >
                    Search
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BookPageModal;
