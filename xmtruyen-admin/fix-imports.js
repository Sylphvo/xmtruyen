const fs = require('fs');
const glob = require('glob');

function fixFiles() {
    const files = fs.readdirSync('src/pages').filter(f => f.endsWith('.tsx')).map(f => 'src/pages/' + f);
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // Remove exact duplicate consecutive or nearby import lines
        const uniqueLines = [];
        const seenImports = new Set();
        
        for (const line of lines) {
            if (line.startsWith('import ')) {
                if (seenImports.has(line.trim())) {
                    continue; // Skip duplicate import
                }
                seenImports.add(line.trim());
            }
            uniqueLines.push(line);
        }
        
        content = uniqueLines.join('\n');
        
        // Let's also remove faAngle... icons from FortAwesome imports
        content = content.replace(/faAngleDoubleLeft,\s*/g, '');
        content = content.replace(/faAngleLeft,\s*/g, '');
        content = content.replace(/faAngleRight,\s*/g, '');
        content = content.replace(/faAngleDoubleRight,\s*/g, '');
        
        // If there's an empty { } in imports, we can clean it, but usually there's other stuff.
        
        fs.writeFileSync(file, content, 'utf8');
    }
}
fixFiles();
