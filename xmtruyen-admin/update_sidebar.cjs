const fs = require('fs');
const targetPath = 'C:/Users/Cilse/source/xomtruyen/XomTruyen_Workspace/xmtruyen-admin/src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

const statuses = {
  'crawlers': 'error',
  'import': 'empty',
  'translation': 'empty',
  'translation-upload': 'empty',
  'translation-glossary': 'empty',
  'audio': 'empty',
  'audio-voices': 'error',
  'book-video': 'error',
  'comic-video': 'error',
  'reports': 'empty',
  'notifications': 'empty',
  'plans': 'empty',
  'coin-packages': 'empty',
  'transactions': 'empty',
  'promotions': 'empty',
  'banners': 'empty',
  'home-sections': 'empty',
  'static-pages': 'empty',
  'faq-management': 'empty',
  'help-articles': 'empty',
  'email-templates': 'error',
  'system-reports': 'error',
  'reading-analytics': 'empty',
  'test-cases': 'error',
  'build-process': 'error'
};

// Clear all existing status properties first to avoid duplicates
content = content.replace(/, status: '(error|empty)'/g, '');

// For each key in statuses, find the object with that id and inject the status
for (const [id, status] of Object.entries(statuses)) {
  const regex = new RegExp(`(\\{ id: '${id}'.*?)\\}`, 'g');
  content = content.replace(regex, `$1, status: '${status}' }`);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Sidebar.tsx updated successfully.');
