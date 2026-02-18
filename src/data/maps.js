export const getTileCoordinates = (lat, lon, zoom) => {
    const n = Math.pow(2, zoom);
    const x = n * ((lon + 180) / 360);
    const latRad = lat * Math.PI / 180;
    const y = n * (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2;
    return { x, y };
};

export const getRelativePosition = (lat, lon, zoom) => {
    const { x, y } = getTileCoordinates(lat, lon, zoom);
    // The tile index is floor(x), floor(y)
    // The relative position inside the tile is fractional part
    const xPct = (x - Math.floor(x)) * 100;
    const yPct = (y - Math.floor(y)) * 100;
    return { x: xPct, y: yPct };
};

// Map definitions matching the download script
export const mapDefinitions = {
    // General Days
    'day-day1': { lat: 41.895, lon: 12.475, zoom: 15, type: 'marker', markerCtx: 'Centro' },
    'day-day2': { lat: 41.854, lon: 12.555, zoom: 15, type: 'marker', markerCtx: 'Acueductos' },
    'day-day3': { lat: 41.900, lon: 12.483, zoom: 16, type: 'marker', markerCtx: 'Trevi' },
    'day-day4': { lat: 41.920, lon: 12.492, zoom: 15, type: 'marker', markerCtx: 'Coppedè' },
    'day-day5': { lat: 41.890, lon: 12.492, zoom: 16, type: 'marker', markerCtx: 'Coliseo' },
    'day-day6': { lat: 41.902, lon: 12.454, zoom: 16, type: 'marker', markerCtx: 'Vaticano' },
    'day-day7': { lat: 41.867, lon: 12.482, zoom: 15, type: 'marker', markerCtx: 'S. Pablo' },

    // Specific Routes
    'day1_walk_bocca': {
        lat: 41.888, lon: 12.481, zoom: 18,
        type: 'route',
        // Example route points: Metro Circo Massimo -> Bocca
        points: [
            { lat: 41.8835, lon: 12.4870 }, // Circo Massimo approx
            { lat: 41.8860, lon: 12.4850 },
            { lat: 41.8882, lon: 12.4815 }  // Bocca
        ]
    },
    'day2_metro_route': {
        lat: 41.851, lon: 12.553, zoom: 15,
        type: 'route',
        points: [
            { lat: 41.852, lon: 12.556 }, // Park start
            { lat: 41.850, lon: 12.550 }  // Park deep
        ]
    },
    'day3_walk_spagna': {
        lat: 41.906, lon: 12.482, zoom: 17,
        type: 'route',
        points: [
            { lat: 41.907, lon: 12.483 }, // Top stairs
            { lat: 41.9056, lon: 12.4823 } // Fountain
        ]
    },
    'day6_walk_vatican': {
        lat: 41.900, lon: 12.460, zoom: 16,
        type: 'route',
        points: [
            { lat: 41.898, lon: 12.464 }, // Castle
            { lat: 41.901, lon: 12.460 }, // Conciliazione
            { lat: 41.902, lon: 12.457 }  // Square
        ]
    }
};
