const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const net = require('net');

const PORT = 5555; // Changed from 5500 to avoid Live Server conflict

// Import auto-analyzer
let autoAnalyzer;
try {
    autoAnalyzer = require('./auto-analyze.js');
} catch (e) {
    console.warn('[WARN] auto-analyze.js not loaded:', e.message);
}

const runCommand = (cmd, cwd) => {
    exec(`start cmd.exe /k "cd /d ${cwd} && ${cmd}"`);
};

const checkPort = (port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(500);
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', () => {
            resolve(false);
        });
        socket.connect(port, '127.0.0.1');
    });
};

const server = http.createServer(async (req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    if (req.url === '/api/start-web') {
        runCommand('npm run dev', path.join(__dirname, '../xom-truyen'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }
    if (req.url === '/api/start-admin') {
        runCommand('npm run dev', path.join(__dirname, '../xmtruyen-admin'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }
    if (req.url === '/api/start-api') {
        runCommand('dotnet run', path.join(__dirname, '../xmtruyen.API'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }
    if (req.url === '/api/status') {
        const webStatus = await checkPort(5173);
        const adminStatus = await checkPort(5174);
        const apiStatus = await checkPort(5000);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            web: webStatus, 
            admin: adminStatus, 
            api: apiStatus 
        }));
    }

    // === AUTO ANALYZER APIs ===
    
    // Trigger phân tích thủ công (nút bấm trên Dashboard)
    if (req.url === '/api/analyze') {
        try {
            if (autoAnalyzer) {
                const changelog = autoAnalyzer.buildChangelog();
                const techstack = autoAnalyzer.buildTechStack();
                const latestDiff = autoAnalyzer.analyzeLatestCommitDiff();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Phân tích hoàn tất!',
                    commits: changelog.totalCommits,
                    technologies: techstack.totalUniqueTechnologies
                }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Auto analyzer not loaded' }));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: err.message }));
        }
    }

    // Đọc changelog JSON
    if (req.url === '/api/changelog') {
        const filePath2 = path.join(__dirname, 'auto-changelog.json');
        if (fs.existsSync(filePath2)) {
            const data = fs.readFileSync(filePath2, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(data);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Chưa có dữ liệu. Hãy chạy /api/analyze trước.' }));
        }
    }

    // Đọc techstack JSON
    if (req.url === '/api/techstack') {
        const filePath2 = path.join(__dirname, 'auto-techstack.json');
        if (fs.existsSync(filePath2)) {
            const data = fs.readFileSync(filePath2, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(data);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Chưa có dữ liệu. Hãy chạy /api/analyze trước.' }));
        }
    }

    // Đọc summary JSON
    if (req.url === '/api/summary') {
        const filePath2 = path.join(__dirname, 'auto-summary.json');
        if (fs.existsSync(filePath2)) {
            const data = fs.readFileSync(filePath2, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(data);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Chưa có dữ liệu. Hãy chạy /api/analyze trước.' }));
        }
    }

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    filePath = filePath.split('?')[0];

    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
        '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg',
        '.gif': 'image/gif', '.svg': 'image/svg+xml'
    };
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404); res.end('File not found: ' + req.url);
            } else {
                res.writeHead(500); res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`Xmtruyen Dashboard Server is running!`);
    console.log(`URL: http://127.0.0.1:${PORT}`);
    console.log(`===================================================`);
});
