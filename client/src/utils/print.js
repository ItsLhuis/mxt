export const print = (html, { margin = 0 } = {}) => {
  return new Promise((resolve, reject) => {
    const fakeIFrame = document.createElement("iframe")
    document.body.appendChild(fakeIFrame)

    const iframeDoc = fakeIFrame.contentDocument || fakeIFrame.contentWindow.document

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
            <style type="text/css" media="print">
                * {
                    margin: 0;
                    -webkit-print-color-adjust: exact;
                }

                @page {
                    margin: ${margin};
                }

                body {
                    position: relative;
                    min-height: 100vh;
                    font-family: 'Poppins', Arial, sans-serif;
                    font-size: 13px;
                }

                hr {
                    display: block;
                    height: 1px;
                    border: 0;
                    border-top: 1px solid #ccc;
                    padding: 0;
                }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `

    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()

    fakeIFrame.onload = () => {
      try {
        fakeIFrame.contentWindow.focus()
        fakeIFrame.contentWindow.print()

        setTimeout(() => {
          document.body.removeChild(fakeIFrame)
          resolve()
        }, 500)
      } catch (error) {
        document.body.removeChild(fakeIFrame)
        reject(error)
      }
    }

    fakeIFrame.onerror = (error) => {
      document.body.removeChild(fakeIFrame)
      reject(error)
    }
  })
}
