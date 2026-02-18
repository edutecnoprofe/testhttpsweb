
import fs from 'fs';
import path from 'path';

const itineraryPath = path.join(process.cwd(), 'src/data/itinerary.json');
const itinerary = JSON.parse(fs.readFileSync(itineraryPath, 'utf8'));

// Map location description keywords or IDs to local image IDs
const imageMap = {
    'bocca': 'visit_bocca',
    'argentina': 'visit_torre_argentina',
    'gesu': 'visit_gesu',
    'ignacio': 'visit_ignacio',
    'cinecitta': 'visit_cinecitta',
    'laterano': 'visit_laterano',
    'colosseo_night': 'visit_colosseo_night',
    'popolo': 'visit_popolo',
    'trevi': 'visit_trevi',
    'san_luis': 'visit_san_luis',
    'pantheon': 'visit_pantheon',
    'trastevere': 'visit_trastevere',
    'priscilla': 'visit_catacumbas',
    'baroque': 'visit_san_carlo',
    'coliseo_visit': 'visit_colosseo',
    'capitoline': 'visit_capitolinos',
    'altar': 'visit_altar',
    'montorio': 'visit_bramante',
    'cannon': 'visit_gianicolo',
    'vatican_museums': 'visit_vaticano',
    'moses': 'visit_moises',
    'san_paolo': 'visit_san_pablo',
    'san_pedro': 'visit_san_pedro'
};

let updatedCount = 0;

itinerary.days.forEach(day => {
    day.activities.forEach(activity => {
        if (imageMap[activity.id]) {
            activity.imageId = imageMap[activity.id];
            updatedCount++;
        }
    });
});

fs.writeFileSync(itineraryPath, JSON.stringify(itinerary, null, 4), 'utf8');
console.log(`Updated ${updatedCount} activities with local image IDs.`);
