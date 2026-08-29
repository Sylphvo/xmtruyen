import os
import re

files = [
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Books.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Topics.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Categories.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Card
    content = content.replace('className="card border-0 shadow-sm bg-white h-auto"', 'className="card border-0 shadow-sm h-auto" style={{ backgroundColor: \'var(--bs-body-bg)\' }}')
    content = content.replace('className="card-header bg-white border-bottom-0 pt-4 pb-0"', 'className="card-header border-bottom-0 pt-4 pb-0" style={{ backgroundColor: \'transparent\' }}')
    content = re.sub(r'<h5 className="mb-0 fw-semibold text-dark">(.*?)</h5>', r'<h5 className="mb-0 fw-semibold" style={{ color: \'var(--bs-heading-color)\' }}>\1</h5>', content)

    # Forms
    content = content.replace('<Form.Select \n              size="sm" \n              style={{ width: \'70px\' }}', '<Form.Select \n              size="sm" \n              className="bg-transparent text-body border-secondary-subtle"\n              style={{ width: \'70px\' }}')
    content = content.replace('<Form.Control \n              size="sm" \n              type="text" \n              placeholder="Search"', '<Form.Control \n              size="sm" \n              type="text" \n              className="bg-transparent text-body border-secondary-subtle"\n              placeholder="Search"')

    # Table wrapper & setup
    content = content.replace('className="table-responsive flex-grow-1 bg-white"', 'className="table-responsive flex-grow-1"')
    content = content.replace('className="table align-middle mb-0"', 'className="table table-bordered align-middle mb-0 text-body"')
    content = content.replace('style={{ borderCollapse: \'collapse\' }}', 'style={{ borderCollapse: \'collapse\', backgroundColor: \'transparent\' }}')
    
    # Table header
    content = content.replace('backgroundColor: \'#fff\'', 'backgroundColor: \'var(--bs-body-bg)\'')
    content = content.replace('borderBottom: \'2px solid #f1f5f9\'', 'borderBottom: \'1px solid var(--bs-border-color)\'')
    content = content.replace('borderBottom: \'1px solid #f1f5f9\'', 'borderBottom: \'1px solid var(--bs-border-color)\'')

    # Column/Cell styles
    content = content.replace('border: \'none\'', 'backgroundColor: \'transparent\'')
    content = content.replace('text-dark fw-semibold text-nowrap', 'fw-semibold text-nowrap')
    content = content.replace('text-secondary fw-medium', 'fw-medium')

    # Re-sub th and td to add color
    content = re.sub(r'<th style={{(.*?)}}', r'<th style={{\1, color: \'var(--bs-heading-color)\'}}', content)
    content = re.sub(r'<td style={{(.*?)}}', r'<td style={{\1, color: \'var(--bs-body-color)\'}}', content)

    # Empty classes
    content = content.replace(' className="text-secondary"', '')
    content = content.replace(' className=""', '')
    
    # Some td might have `text-secondary` which is removed, let's also remove `text-dark` from span in table if any left
    content = content.replace('<span className="text-dark fw-semibold text-nowrap">', '<span className="fw-semibold text-nowrap">')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
