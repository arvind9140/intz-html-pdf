const pdf = require("intz-html-pdf")
const fs = require("fs").promises
const fs = require("fs")



const pdfGenerate = async (req, res) => {
    const cssContent = await fs.readFile("./style.css", "utf-8");
  
    const imagePath = './data.jpg';
    const imageContent = await fs.readFile(imagePath, "base64"); // Base64 encoding

    const base64Image = `data:image/jpeg;base64,${imageContent}`;
    // Example of options with args //
    let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

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


const generateAndStorePdfs = async (req, res) => {
    const options = { format: "A4" }; 
    const saveDirectory = '../test/'

   
    if (!fs.existsSync(saveDirectory)) {
        fs.mkdirSync(saveDirectory, { recursive: true }); 
    }

    const files = [
        {
            content: "<h1>Welcome to my PDF generator</h1>",
            path: "example1.pdf", 
        },
        {
            content: "<h1>Another example PDF</h1>",
            path: "example2.pdf",
        },
    ];

    try {
        const pdfs = await pdf.generatePdfs(files, options, saveDirectory);

      console.log(  pdfs.map(pdf => ({
            path: pdf.savedPath, 
        })))
    } catch (error) {
        console.log(error)
    }
};
generateAndStorePdfs()


let file = { url:"https://www.corifeus.com/html-pdf"}
const options = { format: "A4" }; // PDF options
const path = "url.pdf";

pdf.generatePdf(file, options, path).then((urlpdf)=>{
    console.log(urlpdf)

})


const saveDirectory = '../test/'

    const files = [
        {
            url: "https://console.initializ.ai/login/",
            path: "url1.pdf", // Name of the saved file
        },
        {
            url: "https://console.initializ.ai/workspace/663b242af9f9cbdb5dc678e3/",
            path: "url2.pdf",
        },
    ];
pdf.generatePdfs(files, options, saveDirectory).then((urlpdf)=>{
    console.log(urlpdf)

})







