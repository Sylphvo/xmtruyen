import os

files = [
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Books.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Topics.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Categories.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace backslash quote with just quote
    content = content.replace(r"\'var", "'var")
    content = content.replace(r")\'", ")'")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
