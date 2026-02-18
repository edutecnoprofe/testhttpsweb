import fs from 'fs';
import path from 'path';
import https from 'https';

const mapsDir = path.join(process.cwd(), 'public', 'assets', 'maps');

// Ensure directory exists
if (!fs.existsSync(mapsDir)) {
    fs.mkdirSync(mapsDir, { recursive: true });
}

// Map definitions with real coordinates
const maps = [
    { name: 'day-day1', lat: 41.895, lon: 12.475, zoom: 15 },
    { name: 'day-day2', lat: 41.854, lon: 12.555, zoom: 15 },
    { name: 'day-day3', lat: 41.900, lon: 12.483, zoom: 16 },
    { name: 'day-day4', lat: 41.920, lon: 12.492, zoom: 15 },
    { name: 'day-day5', lat: 41.890, lon: 12.492, zoom: 16 },
    { name: 'day-day6', lat: 41.902, lon: 12.454, zoom: 16 },
    { name: 'day-day7', lat: 41.867, lon: 12.482, zoom: 15 },

    // Sub-maps
    { name: 'day1_walk_bocca', lat: 41.888, lon: 12.481, zoom: 17 },
    { name: 'day2_metro_route', lat: 41.851, lon: 12.553, zoom: 15 },
    { name: 'day3_walk_spagna', lat: 41.906, lon: 12.482, zoom: 17 },
    { name: 'day6_walk_vatican', lat: 41.900, lon: 12.460, zoom: 16 }
];

const long2tile = (lon, zoom) => (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
const lat2tile = (lat, zoom) => (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));

const downloadTile = (url, filePath, tileDesc) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, { headers: { 'User-Agent': 'RomaApp/1.0' } }, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded ${tileDesc}`);
                    resolve();
                });
            } else {
                fs.unlink(filePath, () => { });
                reject(new Error(`Status ${response.statusCode}`));
            }
        }).on('error', err => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
};

const downloadMapGrid = async (map) => {
    const centerX = long2tile(map.lon, map.zoom);
    const centerY = lat2tile(map.lat, map.zoom);
    const z = map.zoom;

    console.log(`Downloading grid for ${map.name} at zoom ${z}...`);

    // Download 3x3 grid
    const promises = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const x = centerX + dx;
            const y = centerY + dy;
            const fileName = `${map.name}_${dy + 1}_${dx + 1}.png`; // Normalized 0-2 indices
            const filePath = path.join(mapsDir, fileName);
            const url = `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

            promises.push(downloadTile(url, filePath, `${map.name} (${dy + 1},${dx + 1})`));
        }
    }

    try {
        await Promise.all(promises);
        console.log(`Grid for ${map.name} completed.`);
    } catch (err) {
        console.error(`Failed to complete grid for ${map.name}: ${err.message}`);
    }
};

const run = async () => {
    console.log('Downloading real map grids (3x3) from CartoDB...');
    for (const map of maps) {
        await downloadMapGrid(map);
    }
    console.log('All grids downloaded.');
};

run();
