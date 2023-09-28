const express   = require('express');
const cors      = require('cors');
const os        = require('os');
const fs        = require('fs');
const temp = require('temp');
const Sentiment = require("sentiment");
const scraper   = require('./scraper');
const helpers   = require('./helper');

const app  = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors())

temp.track();

app.post('/scrape', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html = await scraper.getHTML(req.body.url);

        var response = {};
        if (req.body.scrappingElements.checkbox_text) {
            const texts     = scraper.getAllText(html);
            const sentiment = new Sentiment();

            var allText = '';
            texts.forEach((text) => {
                allText += text.text + "\n";
            });

            var sentimentScore  = sentiment.analyze(allText).score;
            var sentimentResult = 'neutral';
            if (sentimentScore > 0) {
                sentimentResult = 'positive';
            } else if (sentimentScore < 0) {
                sentimentResult = 'negative';
            }

            response.texts         = texts;
            response.textSentiment = sentimentResult;
        }
        if (req.body.scrappingElements.checkbox_images) {
            var imageLinks  = scraper.getAllImageLinks(html);
            imageLinks      = imageLinks.map((link) => {
                return helpers.linkToAbsoluteUrl(link, req.body.url);
            });
            response.images = imageLinks;
        }
        if (req.body.scrappingElements.checkbox_dates) {
            response.dates = scraper.getAllDates(html);
        }
        if (req.body.scrappingElements.checkbox_links) {
            var links      = scraper.getAllLinks(html);
            links          = links.map((link) => {
                return helpers.linkToAbsoluteUrl(link, req.body.url);
            });
            response.links = links;
        }
        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

app.post('/scrape/text', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html      = await scraper.getHTML(req.body.url)
        const texts     = scraper.getAllText(html);
        const sentiment = new Sentiment();

        var allText = '';
        texts.forEach((text) => {
            allText += text.text + "\n";
        });

        var sentimentScore  = sentiment.analyze(allText).score;
        var sentimentResult = 'neutral';
        if (sentimentScore > 0) {
            sentimentResult = 'positive';
        } else if (sentimentScore < 0) {
            sentimentResult = 'negative';
        }

        res.json({texts: texts, textSentiment: sentimentResult});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

app.post('/scrape/images', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html     = await scraper.getHTML(req.body.url);
        var imageLinks = scraper.getAllImageLinks(html);
        imageLinks     = imageLinks.map((link) => {
            return helpers.linkToAbsoluteUrl(link, req.body.url);
        });
        res.json({images: imageLinks});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

app.post('/scrape/dates', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html = await scraper.getHTML(req.body.url);
        res.json({dates: scraper.getAllDates(html)});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

app.post('/scrape/links', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html = await scraper.getHTML(req.body.url);
        var links  = scraper.getAllLinks(html);
        links      = links.map((link) => {
            return helpers.linkToAbsoluteUrl(link, req.body.url);
        });
        res.json({links: links});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

app.post('/scrape/count-words', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html  = await scraper.getHTML(req.body.url);
        let result  = scraper.getWordCount(html);
        result.text = result.text.map((text) => {
            // remove punctuations before text
            text = text.replace(/^[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            text = text.trim();
            return {text: text};
        });

        res.json({wordCount: result.wordCount, texts: result.text});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while scraping the web page'});
    }
});

// excel export of the same data from /scrape, using excel4node
app.post('/scrape/export', async (req, res) => {
    try {
        if (!helpers.validateUrl(req.body.url)) {
            return res.json({status: 'error', error: 'Invalid URL'});
        }
        const html = await scraper.getHTML(req.body.url);

        var response = {};
        if (req.body.scrappingElements.checkbox_text) {
            response.texts = scraper.getAllText(html);
            response.texts = response.texts.map((text) => {
                return text.text;
            });
        }
        if (req.body.scrappingElements.checkbox_images) {
            var imageLinks  = scraper.getAllImageLinks(html);
            imageLinks      = imageLinks.map((link) => {
                return helpers.linkToAbsoluteUrl(link, req.body.url);
            });
            response.images = imageLinks;
        }
        if (req.body.scrappingElements.checkbox_dates) {
            response.dates = scraper.getAllDates(html);
        }
        if (req.body.scrappingElements.checkbox_links) {
            var links      = scraper.getAllLinks(html);
            links          = links.map((link) => {
                return helpers.linkToAbsoluteUrl(link, req.body.url);
            });
            response.links = links;
        }
        if (Object.keys(response).length === 0) {
            return res.json({status: 'error', error: 'Nothing to export!'});
        }

        var excel      = require('excel4node');
        const workbook = new excel.Workbook();

        const populateWorksheet = (worksheet, data) => {
            data.forEach((item, index) => {
                worksheet.cell(index + 1, 1).string(item);
            });
        };

        if (response.texts) {
            const textsWorksheet = workbook.addWorksheet('Texts');
            populateWorksheet(textsWorksheet, response.texts);
        }
        if (response.images) {
            const imagesWorksheet = workbook.addWorksheet('Images');
            populateWorksheet(imagesWorksheet, response.images);
        }
        if (response.dates) {
            const datesWorksheet = workbook.addWorksheet('Dates');
            populateWorksheet(datesWorksheet, response.dates);
        }
        if (response.links) {
            const linksWorksheet = workbook.addWorksheet('Links');
            populateWorksheet(linksWorksheet, response.links);
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // use quotes around filename to allow spaces
        res.setHeader('Content-Disposition', 'attachment; filename="scrapped_data.xlsx"');

        temp.open('scrapped_data.xlsx', (err, info) => {
            if (err) {
                console.error('Error creating temporary file:', err);
                return res.status(500).json({error: 'Error creating temporary file'});
            }

            workbook.write(info.path, (err) => {
                if (err) {
                    console.error('Error writing to temporary file:', err);
                    return res.status(500).json({error: 'Error writing to temporary file'});
                }

                const fileStream = fs.createReadStream(info.path);
                fileStream.pipe(res);
                temp.cleanup();
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while exporting data to Excel'});
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
