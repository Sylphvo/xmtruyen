import os

files = [
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Books.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Topics.tsx',
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Categories.tsx'
]

target_str = """                      <button className="btn btn-light btn-sm bg-white border shadow-sm rounded-2 px-2 py-1">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>"""

replacement_str = """                      <Dropdown align="end">
                        <Dropdown.Toggle as="div" bsPrefix="p-0 border-0 bg-transparent" style={{ cursor: 'pointer', display: 'inline-block' }}>
                          <button className="btn btn-light btn-sm bg-white border shadow-sm rounded-2 px-2 py-1">
                            <FontAwesomeIcon icon={faEllipsisH} />
                          </button>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 py-2">
                          <Dropdown.Item onClick={() => {}} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}} className="py-2 px-3 text-danger" style={{ fontSize: '14px' }}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>"""

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply replacement
    content = content.replace(target_str, replacement_str)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
