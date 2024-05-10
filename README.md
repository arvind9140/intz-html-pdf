# PDF Generator Package

This package provides functions to generate PDF documents using [Puppeteer](https://github.com/puppeteer/puppeteer), with support for content templating using [Handlebars](https://handlebarsjs.com/) and inline CSS styling. It includes functions for generating single and multiple PDFs, with options for customizing the output and storing generated PDFs to specified locations.

## Installation

To install the package, use npm or yarn:

```bash
# Using npm
npm install intz-html-pdf
```
```
# Using yarn
yarn add intz-html-pdf
```

## Usage


This package provides two primary functions for generating PDFs: `generatePdf` and `generatePdfs`.
generatePdf
The `generatePdf` function creates a single PDF from given HTML content or a URL. It supports inline CSS and templating with Handlebars. Here's an example of how to use it to generate a PDF from a basic HTML string:

The generatePdf function takes a single HTML string

```
const { generatePdf } = require('intz-html-pdf'); 
const path = require('path');

// Function to generate a single PDF
const createSinglePdf = async () => {
  const pdfOptions = {
    format: 'A4',
  };

  const file = {
    content: '<h1>Sample PDF Content</h1><p>This is a simple PDF example.</p>',
  };

  const savePath = path.join(__dirname, 'output.pdf'); 

  try {
    await generatePdf(file, pdfOptions, savePath);
    console.log('PDF generated and saved to', savePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

createSinglePdf();
```

This package provides a function to generate a PDF from a given URL. The generated PDF can be saved to a specified path or returned as a buffer for further processing.


## Generating a PDF from a URL
Here's an example of how to generate a PDF from a URL and save it to a specified path:
```
const { generatePdfFromUrl } = require('intz-html-pdf'); 
const path = require('path');

// Function to generate a PDF from a URL
const createPdfFromUrl = async () => {
  const pdfOptions = {
    format: 'A4', // PDF format
    
  };

 let file = { url:"https://www.corifeus.com/html-pdf"}

  const savePath = path.join(__dirname, 'output.pdf'); // Path to save the generated PDF

  try {
    await generatePdfFromUrl(file, pdfOptions, savePath); 
    console.log('PDF generated and saved to', savePath);
  } catch (error) {
    console.error('Error generating PDF from URL:', error);
  }
};

createPdfFromUrl(); 
```


## generatePdfs
The generatePdfs function creates multiple PDFs from an array of files, each containing either HTML content or a URL to a web page. The PDFs are saved to a specified directory. Here's an example:

```
const { generatePdfs } = require('intz-html-pdf'); 
const path = require('path');

// Function to generate multiple PDFs
const createMultiplePdfs = async () => {
  const pdfOptions = {
    format: 'A4',
  };

  const saveDirectory = path.join(__dirname, 'pdfs'); // Directory to save PDFs

  const files = [
    {
      content: '<h1>PDF 1 Content</h1>',
      path: 'pdf1.pdf',
    },
    {
      content: '<h1>PDF 2 Content</h1>',
      path: 'pdf2.pdf',
    },
  ];

  try {
    const pdfs = await generatePdfs(files, pdfOptions, saveDirectory);

    console.log('PDFs generated and saved to:', pdfs.map(pdf => pdf.savedPath));
  } catch (error) {
    console.error('Error generating PDFs:', error);
  }
};

createMultiplePdfs();

```

In this example, multiple PDFs are generated and saved to a specific directory.


This package offers a function to generate multiple PDFs from an array of URLs. The generated PDFs can be saved to a specified directory for easy retrieval. Here's an example of how to generate multiple PDFs from multiple URLs:

## Generate Multiple PDFs

```
const { generatePdfsFromUrls } = require('intz-html-pdf'); 
const path = require('path');

// Function to generate multiple PDFs from multiple URLs
const createMultiplePdfsFromUrls = async () => {
  const pdfOptions = {
    format: 'A4', // Default format
    
  };

  const saveDirectory = path.join(__dirname, 'pdf-outputs'); 

  const urls = [
    { url: 'https://example.com', filename: 'example1.pdf' },
    { url: 'https://google.com', filename: 'google.pdf' },
    { url: 'https://github.com', filename: 'github.pdf' },
  ];

  try {
    const pdfs = await generatePdfsFromUrls(urls, pdfOptions, saveDirectory);

    pdfs.forEach(pdf => {
      console.log(`PDF saved to: ${pdf.savedPath}`); 
    });

  } catch (error) {
    console.error('Error generating PDFs from URLs:', error);
  }
};

createMultiplePdfsFromUrls(); 
```

This package provides functions to generate PDFs with custom CSS. You can use inline CSS, external stylesheets, or a combination of both. Here's an example of how to generate a PDF with custom or external CSS:

## Generate PDF with Inline CSS
```
const pdf = require("intz-html-pdf")
const fs = require("fs").promises




const pdfGenerate = async (req, res) => {
    const cssContent = await fs.readFile("./style.css", "utf-8");
  
    const imagePath = 'image path';
    const imageContent = await fs.readFile(imagePath, "base64"); // Base64 encoding

    const base64Image = `data:image/jpeg;base64,${imageContent}`;
    let options = { format: 'A4',  };

    const path = "example.pdf"

    let file = {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- For responsive design -->
   <style>${cssContent}</style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="logo">
                <img src=${base64Image} alt="My Website Logo"> <!-- Website logo -->
            </div>
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <div class="container">
            <h1>Welcome to My Website</h1>
            <p>This is the main content area where you can introduce your website's purpose and key information.</p>
            <!-- Additional content sections go here -->
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>© 2024 My Website. All rights reserved.</p>
            <p>
                <a href="#privacy">Privacy Policy</a> |
                <a href="#terms">Terms of Service</a>
            </p>
        </div>
    </footer>

</body>
</html>
` };

    
    pdf.generatePdf(file, options, path).then((pdfBuffer) => {
        console.log("PDF Buffer:-", pdfBuffer);
    });

}
pdfGenerate()
```

## Notes and Recommendations

Handling Errors: Always wrap your code in try-catch blocks to handle errors gracefully.
Puppeteer Options: You can customize Puppeteer launch options with additional arguments.
PDF Options: Adjust the pdfOptions to customize the format, orientation, and other settings.
File Paths: Use the path module to ensure correct file paths for different operating systems.


## Contributing

If you'd like to contribute to this package, please submit a pull request or open an issue on GitHub. Contributions and feedback are welcome.






