
# Galactic Scraper

Galactic Scraper is a web application that allows you to scrape content from a given URL, including text, links, images, and dates. You can also count words in blog posts and export scraped data to an Excel file.

## Getting Started

Follow these steps to set up and run the Galactic Scraper application locally.

### Prerequisites
- Node.js and npm installed on your computer.

### Installation

> The application is also available live at http://64.226.77.29 (I know it's slow, but it's not dead)

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/vcerbea/galactic-scraper.git
   ```
2. Navigate to the project directory:
   ```bash
   cd galactic-scraper
   ```
3. Run the server application
	```bash
	cd server		
	npm i
	npm run start
	```
4. Run the client application
	```bash
	cd ../client # assuming you are still in galactic-scrape/server
	npm i
	npm run serve
	```
5. Access the application:
	[http://localhost:8080/](http://localhost:8080/)

### Endpoints
-   `POST /scrape`: Scrapes content (text, links, images, dates) from a given URL.
-   `POST /scrape/text`: Scrapes text content from a given URL.
-   `POST /scrape/links`: Scrapes links from a given URL.    
-   `POST /scrape/images`: Scrapes images from a given URL.    
-   `POST /scrape/dates`: Scrapes dates from a given URL.    
-   `POST /scrape/count-words`: Counts words in blog posts from a given URL.
-   `POST /scrape/export`: Exports scraped data to an Excel file from a given URL.

All the endoints require a valid `url`  in the body.
`/scrape` and `/scrape/export`  also require
```
scrappingElements: {  
	checkbox_text:   bool,
    checkbox_images: bool,
    checkbox_links:  bool,
    checkbox_dates:  bool
}
```
The server will always answer with a JSON.

## Personal notes
Initially, I created a basic PHP app for scraping, but i soon realized the content on the test website is dynamically generated. I decided to go with nodejs, because of the `puppeteer`.

After setting an `express` server, I created scraper.js, that contains the basic functions needed for scrapping.

My first thought about sentiment analysis was to find 2 dictionaries with positive and negative words, then to find which of them are used the most. However, I accidentally ran into `sentiment` package and realized I don't have to reinvent the wheel.

The word counter is supposed to work on anything but `.classes`, because they might also change. Giving this criteria, I decided to rely on the html structure, based on the fact that every post has an image, a title, a subtitle and the content area. The cons of this solution is that it works (obviously) only on the posts from the test website.

I have never worked with vue.js before, thank you for the challenge.

Finally, as a unique feature of my product, I decided to add an export-to-excel option. The button is placed at the end of the scraped data on the frontend.


[bonus](https://www.youtube.com/watch?v=dQw4w9WgXcQ)