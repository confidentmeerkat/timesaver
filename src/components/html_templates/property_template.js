export const propertyTemplate = ({ title, name, age }) => {
  return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title}</title>
                <link rel="stylesheet" href="https://commit.tailwindui.com/_next/static/css/5f94891378e413bb.css" data-precedence="next">
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
            </body>
        </html>
    `;
};
