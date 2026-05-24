const fs = require('fs');
const tiles = ['17', '18', '19'];
let html = '<html><body>';
tiles.forEach(z => {
    const data = fs.readFileSync(`z${z}.png`).toString('base64');
    html += `<h3>Zoom ${z}</h3><img src="data:image/png;base64,${data}" style="border:1px solid black;" /><br/>`;
});
html += '</body></html>';
fs.writeFileSync('tiles.html', html);
