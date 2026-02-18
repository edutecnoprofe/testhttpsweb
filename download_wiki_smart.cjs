
const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
    // Search terms for Wikimedia Commons
    "visit_gesu.jpg": "File:Piazza_del_Gesù_(Rome).jpg", // Fallback if search fails, but I'll search
    "visit_ignacio.jpg": "Sant'Ignazio Rome ceiling",
    "visit_cinecitta.jpg": "Cinecittà entrance Rome",
    "visit_laterano.jpg": "San Giovanni in Laterano interior nave",
    "visit_san_luis.jpg": "Calling of Saint Matthew Caravaggio",
    "visit_pantheon.jpg": "Pantheon Rome interior oculus",
    "visit_trastevere.jpg": "Santa Maria in Trastevere apse mosaic",
    "visit_catacumbas.jpg": "Catacombs of Priscilla fresco",
    "visit_altar.jpg": "Altare della Patria night Rome",
    "visit_bramante.jpg": "Tempietto del Bramante Rome",
    "visit_gianicolo.jpg": "Rome view from Gianicolo",
    "visit_san_pedro.jpg": "St. Peter's Basilica interior nave"
};

// Also fixed Gesu search term to be more specific to ceiling
images["visit_gesu.jpg"] = "Triumph of the Name of Jesus Il Baciccio";

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
        console.log(`Searching for: ${searchTerm}...`);
        // 1. Search for file
        const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&format=json`;
        const searchData = await fetchJson(searchUrl);

        if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
            console.error(`No results found for ${searchTerm}`);
            return;
        }

        const title = searchData.query.search[0].title;
        console.log(`Found: ${title}`);

        // 2. Get Image Info (URL)
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
        const infoData = await fetchJson(infoUrl);

        const pages = infoData.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (!page.imageinfo || page.imageinfo.length === 0) {
            console.error(`No image info for ${title}`);
            return;
        }

        const imageUrl = page.imageinfo[0].url;
        console.log(`Downloading from: ${imageUrl}`);

        // 3. Download
        await downloadImage(imageUrl, path.join(outputDir, filename));
        console.log(`Saved to ${filename}`);

    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
    }
}

async function main() {
    for (const [filename, term] of Object.entries(images)) {
        // Skip valid images? No, existing ones are corrupted (126KB)
        await searchAndDownload(filename, term);
        // Delay to be polite
        await new Promise(r => setTimeout(r, 1500));
    }
}

main();
