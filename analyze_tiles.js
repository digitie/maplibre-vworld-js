const fs = require('fs');

function isSolidColor(filename) {
    const buffer = fs.readFileSync(filename);
    // Simple check: if file is very small, it might be solid color.
    console.log(`${filename}: ${buffer.length} bytes`);
}

isSolidColor('z17.png');
isSolidColor('z18.png');
isSolidColor('z19.png');
