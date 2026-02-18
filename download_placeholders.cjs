
const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
    "visit_gesu.jpg": "Chiesa del Gesu",
    "visit_ignacio.jpg": "Sant Ignazio Ceiling",
    "visit_cinecitta.jpg": "Cinecitta Entrance",
    "visit_laterano.jpg": "San Giovanni Laterano",
    "visit_san_luis.jpg": "San Luigi Caravaggio",
    "visit_pantheon.jpg": "Pantheon Oculus",
    "visit_trastevere.jpg": "Santa Maria Trastevere",
    "visit_catacumbas.jpg": "Catacombe Priscilla",
    "visit_altar.jpg": "Altare della Patria",
    "visit_bramante.jpg": "Tempietto Bramante",
    "visit_gianicolo.jpg": "Gianicolo View",
    "visit_san_pedro.jpg": "San Pietro Basilica"
};

const outputDir = path.join(__dirname, 'public/assets/images');

function downloadImage(filename, text) {
    const url = `https://placehold.co/800x600/EEE/31343C/png?text=${encodeURIComponent(text)}`;
    const dest = path.join(outputDir, filename);

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // recursive for redirect? placehold.co usually doesn't redirect
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Saved ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    console.log("Downloading placeholders...");
    for (const [filename, text] of Object.entries(images)) {
        await downloadImage(filename, text);
    }
    console.log("Done.");
}

main();
