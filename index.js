const puppeteer = require("puppeteer");
var Promise = require("bluebird");
const hb = require("handlebars");
const inlineCss = require("inline-css");

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
            const bodyStyle = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
            console.log("Body background color:", bodyStyle)

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
async function generatePdfs(files, options, callback) {
    // we are using headless mode
    let args = ["--no-sandbox", "--disable-setuid-sandbox",'--disable-gpu'];
    if (options.args) {
        args = options.args;
        delete options.args;
    }
    const browser = await puppeteer.launch({
        args: args,
    });
    let pdfs = [];
    const page = await browser.newPage();
    for (let file of files) {
        if (file.content) {
            data = await inlineCss(file.content, { url: "/" });
            console.log("Compiling the template with handlebars");
            // we have compile our code with handlebars
            const template = hb.compile(data, { strict: true });
            const result = template(data);
            const html = result;
            // We set the page content as the generated html by handlebars
            await page.setContent(html, {
                waitUntil: "networkidle0", // wait for page to load completely
            });
        } else {
            await page.goto(file.url, {
                waitUntil: "networkidle0", // wait for page to load completely
            });
        }
        let pdfObj = JSON.parse(JSON.stringify(file));
        delete pdfObj["content"];
        pdfObj["buffer"] = Buffer.from(Object.values(await page.pdf(options)));
        pdfs.push(pdfObj);
    }

    return Promise.resolve(pdfs)
        .then(async function (data) {
            await browser.close();
            return data;
        })
        .asCallback(callback);
}

module.exports.generatePdf = generatePdf;
module.exports.generatePdfs = generatePdfs;