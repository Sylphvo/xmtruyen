const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const net = require('net');

const PORT = 5555; // Changed from 5500 to avoid Live Server conflict

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
        runCommand('npm run dev', path.join(__dirname, '../xomtruyen-admin'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }
    if (req.url === '/api/start-api') {
        runCommand('dotnet run', path.join(__dirname, '../xomtruyen.API'));
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
    console.log(`XomTruyen Dashboard Server is running!`);
    console.log(`URL: http://127.0.0.1:${PORT}`);
    console.log(`===================================================`);
});
