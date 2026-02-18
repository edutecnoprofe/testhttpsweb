
const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    { key: "visit_gesu.jpg", term: "File:The_Triumph_of_the_Name_of_Jesus_by_Baciccia.jpg" },
    { key: "visit_ignacio.jpg", term: "File:Sant_ignazio_ceiling.jpg" },
    { key: "visit_cinecitta.jpg", term: "File:Cinecitta-ingresso.jpg" },
    { key: "visit_laterano.jpg", term: "San Giovanni in Laterano interior nave" },
    { key: "visit_san_luis.jpg", term: "Calling of Saint Matthew Caravaggio" },
    { key: "visit_pantheon.jpg", term: "Pantheon Rome interior oculus" },
    { key: "visit_trastevere.jpg", term: "Santa Maria in Trastevere apse mosaic" },
    { key: "visit_catacumbas.jpg", term: "Catacombs of Priscilla fresco" },
    { key: "visit_altar.jpg", term: "Altare della Patria night" },
    { key: "visit_bramante.jpg", term: "Tempietto del Bramante" },
    { key: "visit_gianicolo.jpg", term: "Rome view Gianicolo" },
    { key: "visit_san_pedro.jpg", term: "St. Peter's Basilica interior nave" }
];

const outputDir = path.join(__dirname, 'public/assets/images');
const userAgent = "MyTravelAppBot/1.0 (https://github.com/myuser/mytravelapp; contact@example.com)";

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': userAgent } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                // If 403, try without user agent? No, that's worse.
                fs.unlink(dest, () => { }); // Delete empty file
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function searchAndDownload(filename, searchTerm) {
    try {
        console.log(`Processing ${filename} (${searchTerm})...`);
        let title = searchTerm;

        // 1. If not starting with "File:", search for it
        if (!searchTerm.startsWith("File:")) {
            const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&format=json`;
            const searchData = await fetchJson(searchUrl);

            if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
                console.error(`  No results found for ${searchTerm}`);
                return;
            }
            title = searchData.query.search[0].title;
            console.log(`  Found title: ${title}`);
        }

        // 2. Get Image Info (URL)
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
        const infoData = await fetchJson(infoUrl);

        const pages = infoData.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (pageId === "-1" || !page.imageinfo || page.imageinfo.length === 0) {
            console.error(`  No image info for ${title}`);
            return;
        }

        const imageUrl = page.imageinfo[0].url;
        console.log(`  Downloading from: ${imageUrl}`);

        // 3. Download
        await downloadImage(imageUrl, path.join(outputDir, filename));
        console.log(`  Saved to ${filename}`);

    } catch (error) {
        console.error(`  Error processing ${filename}:`, error.message);
    }
}

async function main() {
    for (const item of images) {
        await searchAndDownload(item.key, item.term);
        // Delay 1.5s
        await new Promise(r => setTimeout(r, 1500));
    }
}

main();
