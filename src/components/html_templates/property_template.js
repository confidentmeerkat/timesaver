export const propertyTemplate = ({ image }) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
            rel="stylesheet"
            href="https://commit.tailwindui.com/_next/static/css/5f94891378e413bb.css"
            data-precedence="next"
        />
        <link
            href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
            rel="stylesheet"
        />
        <style>
            .col-span-2 {
            grid-column: span 2 / span 2;
            }
            .col-span-3 {
            grid-column: span 3 / span 3;
            }
            .col-span-5 {
            grid-column: span 5 / span 5;
            }
            .col-span-9 {
            grid-column: span 9 / span 9;
            }
            .mb-3 {
            margin-bottom: 0.75rem;
            }
            .mt-2 {
            margin-top: 0.5rem;
            }
            .mt-5 {
            margin-top: 1.25rem;
            }
            .grid {
            display: grid;
            }
            .grid-cols-12 {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            }
            .grid-cols-7 {
            grid-template-columns: repeat(7, minmax(0, 1fr));
            }
            .grid-cols-8 {
            grid-template-columns: repeat(8, minmax(0, 1fr));
            }
            .gap-10 {
            gap: 2.5rem;
            }
            .gap-5 {
            gap: 1.25rem;
            }
            .border {
            border-width: 1px;
            }
            .border-2 {
            border-width: 2px;
            }
            .border-b-\[1px\] {
            border-bottom-width: 1px;
            }
            .border-b-\[2px\] {
            border-bottom-width: 2px;
            }
            .border-solid {
            border-style: solid;
            }
            .border-\[\#E0E0E0\] {
            --tw-border-opacity: 1;
            border-color: rgb(224 224 224 / var(--tw-border-opacity));
            }
            .border-gray-300 {
            --tw-border-opacity: 1;
            border-color: rgb(209 213 219 / var(--tw-border-opacity));
            }
            .border-b-gray-400 {
            --tw-border-opacity: 1;
            border-bottom-color: rgb(156 163 175 / var(--tw-border-opacity));
            }
            .bg-\[\#F8F8F8\] {
            --tw-bg-opacity: 1;
            background-color: rgb(248 248 248 / var(--tw-bg-opacity));
            }
            .bg-white {
            --tw-bg-opacity: 1;
            background-color: rgb(255 255 255 / var(--tw-bg-opacity));
            }
            .p-2 {
            padding: 0.5rem;
            }
            .p-3 {
            padding: 0.75rem;
            }
            .p-4 {
            padding: 1rem;
            }
            .py-1 {
            padding-bottom: 0.25rem;
            padding-top: 0.25rem;
            }
            .py-4 {
            padding-bottom: 1rem;
            padding-top: 1rem;
            }
            .pb-2 {
            padding-bottom: 0.5rem;
            }
            .pb-3 {
            padding-bottom: 0.75rem;
            }
            .pb-\[2px\] {
            padding-bottom: 2px;
            }
            .pl-2 {
            padding-left: 0.5rem;
            }
            .pr-2 {
            padding-right: 0.5rem;
            }
            .text-center {
            text-align: center;
            }
            .text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
            }
            .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
            }
            .text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
            }
            .font-\[500\] {
            font-weight: 500;
            }
            .font-bold {
            font-weight: 700;
            }
            .text-gray-500 {
            --tw-text-opacity: 1;
            color: rgb(107 114 128 / var(--tw-text-opacity));
            }
            .underline {
            text-decoration-line: underline;
            }
            .shadow-md {
            --tw-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
            --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
                0 2px 4px -2px var(--tw-shadow-color);
            box-shadow: 0 0 #0000, 0 0 #0000, var(--tw-shadow);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            }
            .box-container {
            padding: 10px;
            min-height: 100vh;
            }
        </style>
        </head>
        <body>
        <div class="box-container bg-[#F8F8F8]">
            <!-- <p class="py-4 text-2xl">Property Name</p> -->
            <div class="grid grid-cols-5 gap-10">
            <!-- <div class="col-span-2">
            </div> -->
            <div class="col-span-2">
                <div>
                <img
                    src=${image}
                    alt="property image"
                    style="width: 100%"
                />
                </div>
                <div>
                <p class="mt-2 mb-3 text-xl font-bold">Propery Information</p>
                <div
                    class="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400"
                >
                    <div class="grid grid-cols-8 pb-3 gap-5">
                    <p class="col-span-3 font-[500] pb-[2px]">Address</p>
                    <p class="col-span-5 pb-[2px]">
                        391 South Street, Village; Hyannis
                    </p>
                    </div>
    
                    <div class="grid grid-cols-8 pb-3 gap-5">
                    <p class="col-span-3 font-[500] pb-[2px]">Parcel</p>
                    <p class="col-span-5 pb-[2px]">308 / 219/</p>
                    </div>
    
                    <div class="grid grid-cols-8 pb-3 gap-5">
                    <p class="col-span-3 font-[500] pb-[2px]">Owner Name</p>
                    <p class="col-span-5 pb-[2px]">ANK Reality LLC</p>
                    </div>
    
                    <div class="grid grid-cols-8 pb-3 gap-5">
                    <p class="col-span-3 font-[500] pb-[2px]">Owner Address</p>
                    <p class="col-span-5 pb-[2px]">
                        775 Main Street Hyannis Ma 02601
                    </p>
                    </div>
                </div>
                </div>
    
                <div>
                <p class="mt-2 mb-3 text-xl font-bold">
                    Total and most recent assessed value of property
                </p>
                <div
                    class="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400"
                >
                    <p class="col-span-3 font-[500] pb-[2px]">$ 573, 700</p>
                </div>
                </div>
    
                <div>
                <p class="mt-2 mb-3 text-xl font-bold">
                    Total and most recent tax information
                </p>
                <div
                    class="border-solid border-2 border-gray-250 border-[#E0E0E0] bg-white p-3 shadow-md border-b-gray-400"
                >
                    <p class="col-span-3 font-[500] pb-[2px]">$ 573, 700</p>
                </div>
                </div>
            </div>
            <div class="col-span-3">
                <div class="border border-solid border-gray-300">
                <div
                    class="p-4 pb-2 text-center border border-solid border-gray-300 text-gray-500 font-bold"
                >
                    Sales History
                </div>
                <div class="p-2">
                    <div
                    class="grid grid-cols-12 font-[500] border-solid border-b-[2px]"
                    >
                    <div class="col-span-5 pl-2">Owner</div>
                    <div class="col-span-2 pl-2">Sale_Date</div>
                    <div class="col-span-2 pl-2">Book_page</div>
                    <div class="col-span-3 pl-2">Sale Price</div>
                    </div>
    
                    <div class="grid grid-cols-12 py-1 border-solid border-b-[1px]">
                    <div class="col-span-5">Owner</div>
                    <div class="col-span-2">Sale_Date</div>
                    <div class="col-span-2">Book_page</div>
                    <div class="col-span-3">Sale Price</div>
                    </div>
                </div>
                </div>
    
                <div class="border border-solid border-gray-300 mt-5">
                <div
                    class="p-4 pb-2 text-center border border-solid border-gray-300 text-gray-500 font-bold"
                >
                    Deed
                </div>
                <div class="p-2 text-center">
                    <div
                    class="grid grid-cols-12 font-[500] border-solid border-b-[2px]"
                    >
                    <div class="col-span-3">Owner</div>
                    <div class="col-span-9">Sale_Date</div>
                    </div>
    
                    <div class="grid grid-cols-12 py-1 border-solid border-b-[2px]">
                    <div class="col-span-3">Seller</div>
                    <div class="col-span-9">Allen J.White</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </body>
    </html>
    `;
};
