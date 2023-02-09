const express = require('express')
const puppeteer = require('puppeteer')
const cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path')

const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
console.log("Server Started");


let API_KEY = process.env.API_KEY;

const webSteal = async (celebName) => {
    const browser = await puppeteer.launch({headless:true});

    const baseUrl = "https://www.rottentomatoes.com/celebrity/";

    const page = await browser.newPage();
    await page.setUserAgent("'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';")

    
    //This code lets us navigate to our desired page, as well as check the response code
    let code = (await page.goto(baseUrl + celebName)).status()
    
    //if the code sent back isn't OK (200), then we try an alternate url.
    if ( code !=200) {
        let nameTest = celebName.split("_");
        console.log("Something happened, code:",code);
        if (nameTest.length == 3) {
            console.log("Plan B");
            await page.goto(baseUrl+nameTest[0]+"_"+nameTest[2])
            await page.waitForNetworkIdle()
            await page.screenshot({ path: 'planB.png' })
        }    
    }

    
    const data = await page.evaluate(() => {
        
        const medias = document.body.querySelectorAll("tbody")

        let bioContainer = document.querySelector('.celebrity-bio');

        let bioData = bioContainer.innerText.split('\n\n');

        let bestAndWorst = document.querySelectorAll(".celebrity-bio__item")

        //Scraping the bio part of the page.
        let headerContent = {
            pfp: bioContainer.querySelector('.celebrity-bio__hero-img')?.getAttribute('src'),
            name: bioData[0],
            best_movie: {
                icon: bestAndWorst[0].querySelector(".icon")?.getAttribute("title"),
                name: bestAndWorst[0].querySelector("a")?.innerText,
                href: bestAndWorst[0].querySelector("a")?.getAttribute("href"),
                score: bestAndWorst[0].querySelector(".label")?.innerText.split("%")[0].trim()
            },
            worst_movie: {
                icon: bestAndWorst[1].querySelector(".icon")?.getAttribute("title"),
                name: bestAndWorst[1].querySelector("a")?.innerText,
                href: bestAndWorst[1].querySelector("a")?.getAttribute("href"),
                score: bestAndWorst[1].querySelector(".label")?.innerText.split("%")[0].trim()
            },
            birthday: bioData[3],
            birthplace: bioData[4],
            biography: bioData[5]

        };

        let mediaContent = []

        Array.from(medias).map(x => {
            let mediaRow = x.querySelectorAll("tr");

            Array.from(mediaRow).map(y => {

                // Only getting movies/shows that aren't talk shows, and also reviewed by both audiences and critics.
                if (y.querySelector(".celebrity-filmography__credits").innerText != "Guest" && (y.getAttribute('data-audiencescore') !== '0' && y.getAttribute('data-tomatometer') != '0')) {

                    let icons= y.querySelectorAll('.icon--tiny')

                    let mediaObj = {
                        name: y.getAttribute('data-title'),
                        href: y.querySelector('a').getAttribute("href"),
                        year: y.getAttribute('data-year'),
                        role: y.querySelector('.celebrity-filmography__credits')?.innerText,
                        thumbnail: "",
                        critic_rating: parseInt(y.getAttribute('data-tomatometer')),
                        audience_rating: parseInt(y.getAttribute('data-audiencescore')),
                        box_office: y.getAttribute('data-boxoffice'),
                        critic_icon: icons[0].getAttribute('title'),
                        audience_icon: icons[1].getAttribute('title')
                    }
                    mediaContent.push(mediaObj)
                }

            })
        })
        return {
            bio: headerContent,
            works: mediaContent
        }
    })
    await browser.close()
    return data;
}

app.get('/api/scrape/:q', async (req, res) => {
    console.log("SCRAPING FOR:", req.params.q);

    let scrapedData = await webSteal(req.params.q);
    // console.log(scrapedData);
    console.log("Finished Scraping for",req.params.q);
    console.log("-".repeat(40));
    res.json(scrapedData);

})

app.get('/api/search/:q', async (req, res) => {
    console.log("SEARCHING FOR:", req.params.q);
    let query = await fetch(`https://api.themoviedb.org/3/search/person?&api_key=${API_KEY}&language=en-US&query=` + req.params.q)

    console.log("FINISHED SEARCHING FOR:",req.params.q);
    console.log("-".repeat(40));

    res.json(await query.json())

})

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})


app.listen(4000)