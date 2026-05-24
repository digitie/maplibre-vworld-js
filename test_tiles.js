const https = require('https');
const fs = require('fs');
const API_KEY = process.env.VITE_VWORLD_API_KEY;

if (!API_KEY) {
    throw new Error('VITE_VWORLD_API_KEY 환경변수를 설정하세요.');
}

function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

const lon = 127.0246;
const lat = 37.5326;

async function checkZoom(z) {
    const x = lon2tile(lon, z);
    const y = lat2tile(lat, z);
    const url = `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Base/${z}/${y}/${x}.png`;
    
    return new Promise((resolve) => {
        https.get(url, (res) => {
            const file = fs.createWriteStream(`z${z}.png`);
            res.pipe(file);
            file.on('finish', () => resolve());
        });
    });
}

async function run() {
    await checkZoom(17);
    await checkZoom(18);
    await checkZoom(19);
}

run();
