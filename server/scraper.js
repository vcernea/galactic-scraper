const puppeteer = require('puppeteer');
const cheerio   = require('cheerio');
const Sentiment = require('sentiment');

// Function to get the HTML of a page
async function getHTML(url) {
    const browser = await puppeteer.launch({headless: "new"});
    const page    = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('body');
    const scrapedHTML = await page.evaluate(() => {
        return document.body.innerHTML;
    });
    await browser.close();
    return scrapedHTML;
}

// Function to return all relevant text (grouped if possible)
function getAllText(html) {
    const $         = cheerio.load(html);
    const texts     = [];
    let allText     = '';
    const sentiment = new Sentiment();

    $('div, p, span, h1, h2, h3, h4, h5, h6, a, li, strong').each((index, element) => {
        if (($(element)[0].name.toLowerCase() === 'div' && $(element).children().length === 0 && $(element).text().trim() !== '') ||
            ($(element)[0].name.toLowerCase() !== 'div' && $(element).text().trim() !== '')) {
            var sentimentScore  = sentiment.analyze($(element).text()).score;
            var sentimentResult = 'neutral';
            if (sentimentScore > 0) {
                sentimentResult = 'positive';
            } else if (sentimentScore < 0) {
                sentimentResult = 'negative';
            }
            texts.push({
                text:      $(element).text(),
                sentiment: sentimentResult
            });
            allText += $(element).text() + "\n";
        }
    });

    return texts;
}

// Function to return all image links
function getAllImageLinks(html) {
    const $          = cheerio.load(html);
    const imageLinks = [];

    $('img').each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
            imageLinks.push(src);
        }
    });

    return imageLinks;
}

// Function to return all dates from time tags
function getAllDates(html) {
    const $        = cheerio.load(html);
    const dateTags = [];

    $('time').each((index, element) => {
        const date = $(element).text();
        if (date) {
            dateTags.push(date);
        }
    });

    return dateTags;
}

// Function to return all links
function getAllLinks(html) {
    const $     = cheerio.load(html);
    const links = [];

    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href && !links.includes(href)) {
            links.push(href);
        }
    });

    return links;
}

// Function to return the word count of a blog post (specific html structure)
function getWordCount(html) {
    const $ = cheerio.load(html);

    // a blog post has a '{parent} > div > div > img' on the left and another '{parent} > div' with 3 other divs as children on the right
    // we are interested in the last kid of the div on the right
    const parent      = $('div > div > img').parent().parent().parent();
    const textSection = parent.children().last();
    const postContent = textSection.children().first().children().last();

    var phrases = [];

    function recursiveGetText(element, texts) {
        if (element.children().length === 0 && element.text().trim() !== '') {
            texts.push(element.text());
        } else {
            $(element).contents().map((index, child) => {
                if (child.type === 'text' && child.data.trim() !== '') {
                    texts.push(child.data);
                }
            });
            element.children().each((index, child) => {
                recursiveGetText($(child), texts);
            });
        }
    }
    recursiveGetText(postContent, phrases);

    var t     = phrases.join(' ');
    var words = t.split(' ').filter((word) => {
        // remove empty strings, strings with only whitespace, and strings with only punctuation
        return word !== '' && word.trim() !== '' && !word.match(/^[.,\/#!$%\^&\*;:{}=\-_`~()]*$/);
    });

    return {'wordCount': words.length, 'text': phrases};
}


module.exports = {
    getHTML,
    getAllText,
    getAllImageLinks,
    getAllDates,
    getAllLinks,
    getWordCount
};
