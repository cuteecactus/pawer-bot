
const fs = require('fs');
const path = require('path');

function getCommandFiles(dir) {
    let results = [];

    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            results = results.concat(getCommandFiles(fullPath));
        } else if (file.name.endsWith('.js')) {
            results.push(fullPath);
        }
    }

    return results;
}

module.exports = getCommandFiles;
