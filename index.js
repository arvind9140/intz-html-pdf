const puppeteer = require("puppeteer");
var Promise = require("bluebird");
const hb = require("handlebars");
const inlineCss = require("inline-css");
const path = require("path")
const fs  = require("fs")

async function generatePdf(file, pdfOptions,pdfpath, callback) {
    const args = ["--no-sandbox", "--disable-setuid-sandbox" ,'--headless', '--disable-gpu'];
    if (pdfOptions.args) {
        args.push(...pdfOptions.args);
        delete pdfOptions.args;
    }
    const browser = await puppeteer.launch({
        args,
        headless: true,
    });
    try {
        const page = await browser.newPage();
        if (file.content) {
            const content = await inlineCss(file.content, { url: "/" });
            const template = hb.compile(content, { strict: true });
            const html = template({}); 
            await page.setContent(html, { waitUntil: "networkidle0" });
            await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
           

        } else {
            await page.goto(file.url, {
                waitUntil: ["load", "networkidle0"],
            });
        }
        await page.pdf({
            ...pdfOptions,
            path: pdfpath, 
            printBackground: true
        });

        await browser.close(); 
        if (callback) {
            callback(null, pdfpath);
        }
        return pdfpath;
    } catch (error) {
        await browser.close(); 

        if (callback) {
            callback(error);
        }
        throw error;
    }
}
const generatePdfs = async (files, options, saveDirectory) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const pdfs = [];
    const page = await browser.newPage();

    try {
        for (const file of files) {
            if (file.content) {
                const inlineCss = require("inline-css");
                const hb = require("handlebars");

                const compiledData = await inlineCss(file.content, { url: "/" });
                const template = hb.compile(compiledData, { strict: true });
                const result = template(compiledData);

                await page.setContent(result, {
                    waitUntil: "networkidle0",
                });
            } else {
                await page.goto(file.url, {
                    waitUntil: "networkidle0",
                });
            }

            const pdfBuffer = await page.pdf({ ...options, printBackground: true });
            const savePath = path.join(saveDirectory, `${file.path}`); 
            fs.writeFileSync(savePath, pdfBuffer);

            pdfs.push({
                ...file,
                buffer: pdfBuffer,
                savedPath: savePath, 
            });
        }
    } catch (error) {
        console.error("Error generating PDFs:", error);
        throw new Error("Error generating PDFs");
    } finally {
        await browser.close(); 
    }

    return pdfs; 
};




module.exports.generatePdf = generatePdf;
module.exports.generatePdfs = generatePdfs;