/**
 * XÓM TRUYỆN - AUTO ANALYZER
 * ============================================================
 * Script tự động phân tích workspace sau mỗi lần commit:
 * 1. Đọc git log → tạo changelog entries
 * 2. Đọc git tags → ghi nhận version
 * 3. Quét package.json, .csproj, imports → liệt kê tech stack
 * 
 * Kết quả ghi ra: auto-changelog.json & auto-techstack.json
 * File JSON này được app.js đọc để hiển thị trên Dashboard.
 * ============================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Thư mục gốc workspace
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = __dirname;

// ============================================================
// 1. PHÂN TÍCH GIT LOG → CHANGELOG
// ============================================================

function getGitLog(maxEntries = 50) {
    try {
        // Format: hash|date|author|subject|body
        const separator = '|||';
        const format = `%H${separator}%ai${separator}%an${separator}%s${separator}%b`;
        const cmd = `git log --pretty=format:"${format}" -n ${maxEntries}`;
        const output = execSync(cmd, { cwd: WORKSPACE_ROOT, encoding: 'utf-8' });

        const commits = output
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const parts = line.split(separator);
                return {
                    hash: (parts[0] || '').trim().substring(0, 8),
                    fullHash: (parts[0] || '').trim(),
                    date: (parts[1] || '').trim(),
                    author: (parts[2] || '').trim(),
                    subject: (parts[3] || '').trim(),
                    body: (parts[4] || '').trim()
                };
            });

        return commits;
    } catch (err) {
        console.error('[ERROR] Không thể đọc git log:', err.message);
        return [];
    }
}

function getGitTags() {
    try {
        const cmd = 'git tag --sort=-creatordate --format="%(refname:short)|||%(creatordate:short)|||%(subject)"';
        const output = execSync(cmd, { cwd: WORKSPACE_ROOT, encoding: 'utf-8' });

        return output
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const parts = line.split('|||');
                return {
                    tag: (parts[0] || '').trim(),
                    date: (parts[1] || '').trim(),
                    message: (parts[2] || '').trim()
                };
            });
    } catch (err) {
        console.error('[WARN] Không có git tags:', err.message);
        return [];
    }
}

function getFilesChangedInCommit(hash) {
    try {
        const cmd = `git diff-tree --no-commit-id --name-status -r ${hash}`;
        const output = execSync(cmd, { cwd: WORKSPACE_ROOT, encoding: 'utf-8' });

        return output
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [status, ...fileParts] = line.split('\t');
                const file = fileParts.join('\t');
                return {
                    status: status.trim(), // A=Added, M=Modified, D=Deleted
                    file: file.trim()
                };
            });
    } catch (err) {
        return [];
    }
}

function detectChangeType(subject, files) {
    const subjectLower = subject.toLowerCase();

    if (subjectLower.includes('fix') || subjectLower.includes('bug') || subjectLower.includes('sửa'))
        return 'Sửa Lỗi (Bug Fix)';
    if (subjectLower.includes('feat') || subjectLower.includes('thêm') || subjectLower.includes('tạo') || subjectLower.includes('add'))
        return 'Tính Năng Mới (Feature)';
    if (subjectLower.includes('refactor') || subjectLower.includes('tái cấu trúc'))
        return 'Tái Cấu Trúc (Refactor)';
    if (subjectLower.includes('style') || subjectLower.includes('css') || subjectLower.includes('ui'))
        return 'Giao Diện (UI/UX)';
    if (subjectLower.includes('doc') || subjectLower.includes('readme') || subjectLower.includes('tài liệu'))
        return 'Tài Liệu (Documentation)';
    if (subjectLower.includes('deploy') || subjectLower.includes('ci') || subjectLower.includes('build'))
        return 'Triển Khai (DevOps)';
    if (subjectLower.includes('perf') || subjectLower.includes('optimize') || subjectLower.includes('tối ưu'))
        return 'Tối Ưu (Performance)';
    if (subjectLower.includes('test'))
        return 'Kiểm Thử (Testing)';

    return 'Cập Nhật (Update)';
}

function detectSubsystem(files) {
    const subsystems = new Set();

    for (const { file } of files) {
        if (file.startsWith('xom-truyen/') || file.startsWith('xom-truyen\\'))
            subsystems.add('Web Client');
        else if (file.startsWith('xmtruyen-admin/') || file.startsWith('xmtruyen-admin\\'))
            subsystems.add('Admin Portal');
        else if (file.startsWith('xmtruyen-app/') || file.startsWith('xmtruyen-app\\'))
            subsystems.add('Mobile App');
        else if (file.startsWith('xmtruyen.API/') || file.startsWith('xmtruyen.API\\'))
            subsystems.add('Backend API');
        else if (file.startsWith('xmtruyen-overview/') || file.startsWith('xmtruyen-overview\\'))
            subsystems.add('Overview Dashboard');
        else if (file.includes('.sql') || file.includes('migration'))
            subsystems.add('PostgreSQL DB');
        else
            subsystems.add('Workspace');
    }

    return Array.from(subsystems);
}

function buildChangelog() {
    console.log('[1/3] Đang phân tích Git Log...');

    const commits = getGitLog(50);
    const tags = getGitTags();
    const latestTag = tags.length > 0 ? tags[0].tag : 'v0.0.0';

    const changelog = commits.map(commit => {
        const files = getFilesChangedInCommit(commit.fullHash);
        const changeType = detectChangeType(commit.subject, files);
        const subsystems = detectSubsystem(files);

        // Tìm tag tương ứng với commit
        let version = null;
        for (const tag of tags) {
            try {
                const tagHash = execSync(`git rev-list -n 1 ${tag.tag}`, {
                    cwd: WORKSPACE_ROOT, encoding: 'utf-8'
                }).trim();
                if (tagHash === commit.fullHash) {
                    version = tag.tag;
                    break;
                }
            } catch (e) { /* ignore */ }
        }

        return {
            hash: commit.hash,
            date: commit.date,
            author: commit.author,
            subject: commit.subject,
            body: commit.body,
            version: version,
            changeType: changeType,
            subsystems: subsystems,
            filesChanged: files.length,
            files: files.slice(0, 20) // Giới hạn 20 file mỗi commit
        };
    });

    const result = {
        generatedAt: new Date().toISOString(),
        latestVersion: latestTag,
        totalCommits: changelog.length,
        tags: tags,
        entries: changelog
    };

    const outputPath = path.join(OUTPUT_DIR, 'auto-changelog.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`   ✅ Đã ghi ${changelog.length} entries → auto-changelog.json`);

    return result;
}

// ============================================================
// 2. QUÉT TECH STACK TỰ ĐỘNG
// ============================================================

function scanPackageJson(filePath, projectName) {
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const deps = Object.keys(content.dependencies || {}).map(name => ({
            name,
            version: content.dependencies[name],
            type: 'dependency'
        }));
        const devDeps = Object.keys(content.devDependencies || {}).map(name => ({
            name,
            version: content.devDependencies[name],
            type: 'devDependency'
        }));

        return {
            project: projectName,
            type: 'Node.js / NPM',
            configFile: path.relative(WORKSPACE_ROOT, filePath),
            version: content.version || '0.0.0',
            scripts: content.scripts || {},
            dependencies: deps,
            devDependencies: devDeps,
            totalDeps: deps.length + devDeps.length
        };
    } catch (err) {
        return null;
    }
}

function scanCsproj(filePath, projectName) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Parse TargetFramework
        const frameworkMatch = content.match(/<TargetFramework>(.*?)<\/TargetFramework>/);
        const framework = frameworkMatch ? frameworkMatch[1] : 'unknown';

        // Parse PackageReferences
        const packages = [];
        const packageRegex = /<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"/g;
        let match;
        while ((match = packageRegex.exec(content)) !== null) {
            packages.push({
                name: match[1],
                version: match[2],
                type: 'NuGet Package'
            });
        }

        return {
            project: projectName,
            type: '.NET / C#',
            configFile: path.relative(WORKSPACE_ROOT, filePath),
            framework: framework,
            dependencies: packages,
            totalDeps: packages.length
        };
    } catch (err) {
        return null;
    }
}

function scanImports(srcDir, projectName, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
    const imports = new Set();

    function walkDir(dir) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist' && item !== 'build') {
                    walkDir(fullPath);
                } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8');
                        // Match: import ... from 'package' or import 'package'
                        const importRegex = /(?:import\s+.*?\s+from\s+['"]([^./][^'"]*?)(?:\/[^'"]*)?['"]|import\s+['"]([^./][^'"]*?)(?:\/[^'"]*)?['"])/g;
                        let m;
                        while ((m = importRegex.exec(content)) !== null) {
                            const pkg = m[1] || m[2];
                            if (pkg && !pkg.startsWith('.') && !pkg.startsWith('@/')) {
                                // Lấy tên package gốc (handle scoped packages @org/pkg)
                                const pkgName = pkg.startsWith('@')
                                    ? pkg.split('/').slice(0, 2).join('/')
                                    : pkg.split('/')[0];
                                imports.add(pkgName);
                            }
                        }

                        // Match: require('package')
                        const requireRegex = /require\(['"]([^./][^'"]*?)(?:\/[^'"]*)?['"]\)/g;
                        while ((m = requireRegex.exec(content)) !== null) {
                            const pkg = m[1];
                            if (pkg && !pkg.startsWith('.')) {
                                const pkgName = pkg.startsWith('@')
                                    ? pkg.split('/').slice(0, 2).join('/')
                                    : pkg.split('/')[0];
                                imports.add(pkgName);
                            }
                        }
                    } catch (e) { /* skip unreadable files */ }
                }
            }
        } catch (e) { /* skip unreadable dirs */ }
    }

    if (fs.existsSync(srcDir)) {
        walkDir(srcDir);
    }

    return {
        project: projectName,
        importedPackages: Array.from(imports).sort()
    };
}

function buildTechStack() {
    console.log('[2/3] Đang quét Tech Stack...');

    const projects = [];

    // 1. Web Client (xom-truyen)
    const webPkg = path.join(WORKSPACE_ROOT, 'xom-truyen', 'package.json');
    if (fs.existsSync(webPkg)) {
        const result = scanPackageJson(webPkg, 'xom-truyen (Web Client)');
        if (result) projects.push(result);
    }

    // 2. Admin Portal (xmtruyen-admin)
    const adminPkg = path.join(WORKSPACE_ROOT, 'xmtruyen-admin', 'package.json');
    if (fs.existsSync(adminPkg)) {
        const result = scanPackageJson(adminPkg, 'xmtruyen-admin (Admin Portal)');
        if (result) projects.push(result);
    }

    // 3. Mobile App (xmtruyen-app)
    const appPkg = path.join(WORKSPACE_ROOT, 'xmtruyen-app', 'package.json');
    if (fs.existsSync(appPkg)) {
        const result = scanPackageJson(appPkg, 'xmtruyen-app (Mobile App)');
        if (result) projects.push(result);
    }

    // 4. Backend API (.NET) - scan .csproj
    const apiCsproj = path.join(WORKSPACE_ROOT, 'xmtruyen.API', 'xmtruyen.API.csproj');
    if (fs.existsSync(apiCsproj)) {
        const result = scanCsproj(apiCsproj, 'xmtruyen.API (Backend API)');
        if (result) projects.push(result);
    }

    // 5. Overview Dashboard
    const overviewPkg = path.join(WORKSPACE_ROOT, 'xmtruyen-overview', 'package.json');
    if (fs.existsSync(overviewPkg)) {
        const result = scanPackageJson(overviewPkg, 'xmtruyen-overview (Dashboard)');
        if (result) projects.push(result);
    }

    // Scan actual imports used in source code
    console.log('   Đang quét import statements trong source code...');
    const importScans = [];

    const webSrc = path.join(WORKSPACE_ROOT, 'xom-truyen', 'src');
    if (fs.existsSync(webSrc)) {
        importScans.push(scanImports(webSrc, 'xom-truyen (Web Client)'));
    }

    const adminSrc = path.join(WORKSPACE_ROOT, 'xmtruyen-admin', 'src');
    if (fs.existsSync(adminSrc)) {
        importScans.push(scanImports(adminSrc, 'xmtruyen-admin (Admin Portal)'));
    }

    const appSrc = path.join(WORKSPACE_ROOT, 'xmtruyen-app', 'src');
    if (fs.existsSync(appSrc)) {
        importScans.push(scanImports(appSrc, 'xmtruyen-app (Mobile App)'));
    }

    // Tổng hợp kỹ thuật duy nhất
    const allTechSet = new Set();
    for (const proj of projects) {
        if (proj.dependencies) {
            for (const dep of proj.dependencies) {
                allTechSet.add(dep.name);
            }
        }
        if (proj.framework) {
            allTechSet.add(proj.framework);
        }
    }

    const result = {
        generatedAt: new Date().toISOString(),
        totalProjects: projects.length,
        totalUniqueTechnologies: allTechSet.size,
        projects: projects,
        importAnalysis: importScans,
        allTechnologies: Array.from(allTechSet).sort()
    };

    const outputPath = path.join(OUTPUT_DIR, 'auto-techstack.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`   ✅ Đã quét ${projects.length} dự án, ${allTechSet.size} công nghệ → auto-techstack.json`);

    return result;
}

// ============================================================
// 3. PHÂN TÍCH DIFF CỦA COMMIT MỚI NHẤT
// ============================================================

function analyzeLatestCommitDiff() {
    console.log('[3/3] Đang phân tích diff commit mới nhất...');

    try {
        const latestHash = execSync('git log -1 --format=%H', {
            cwd: WORKSPACE_ROOT, encoding: 'utf-8'
        }).trim();

        const diffStat = execSync(`git diff --stat ${latestHash}~1..${latestHash}`, {
            cwd: WORKSPACE_ROOT, encoding: 'utf-8'
        }).trim();

        const filesChanged = getFilesChangedInCommit(latestHash);

        // Phân loại files theo loại thay đổi
        const summary = {
            added: filesChanged.filter(f => f.status === 'A').map(f => f.file),
            modified: filesChanged.filter(f => f.status === 'M').map(f => f.file),
            deleted: filesChanged.filter(f => f.status === 'D').map(f => f.file),
            renamed: filesChanged.filter(f => f.status.startsWith('R')).map(f => f.file)
        };

        const result = {
            commitHash: latestHash.substring(0, 8),
            diffStat: diffStat,
            summary: summary,
            totalFiles: filesChanged.length,
            totalAdded: summary.added.length,
            totalModified: summary.modified.length,
            totalDeleted: summary.deleted.length
        };

        console.log(`   ✅ Commit ${result.commitHash}: ${result.totalFiles} files thay đổi`);
        console.log(`      (+${result.totalAdded} added, ~${result.totalModified} modified, -${result.totalDeleted} deleted)`);

        return result;
    } catch (err) {
        console.error('   ⚠️ Không thể phân tích diff:', err.message);
        return null;
    }
}

// ============================================================
// MAIN EXECUTION
// ============================================================

function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  XÓM TRUYỆN - AUTO ANALYZER                        ║');
    console.log('║  Tự động phân tích workspace & ghi nhận thay đổi   ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');

    const changelog = buildChangelog();
    const techstack = buildTechStack();
    const latestDiff = analyzeLatestCommitDiff();

    // Ghi summary tổng hợp
    const summary = {
        generatedAt: new Date().toISOString(),
        workspace: 'Xmtruyen_Workspace',
        latestVersion: changelog.latestVersion,
        totalCommits: changelog.totalCommits,
        totalProjects: techstack.totalProjects,
        totalTechnologies: techstack.totalUniqueTechnologies,
        latestCommit: latestDiff,
        outputFiles: [
            'auto-changelog.json',
            'auto-techstack.json',
            'auto-summary.json'
        ]
    };

    const summaryPath = path.join(OUTPUT_DIR, 'auto-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

    console.log('');
    console.log('════════════════════════════════════════════════════════');
    console.log(`✅ HOÀN TẤT! Đã tạo 3 file JSON trong xmtruyen-overview/`);
    console.log(`   • auto-changelog.json  (${changelog.totalCommits} commits)`);
    console.log(`   • auto-techstack.json  (${techstack.totalUniqueTechnologies} technologies)`);
    console.log(`   • auto-summary.json    (tổng hợp)`);
    console.log('════════════════════════════════════════════════════════');
    console.log('');
}

// Chạy khi được gọi trực tiếp
if (require.main === module) {
    main();
}

module.exports = { buildChangelog, buildTechStack, analyzeLatestCommitDiff };
