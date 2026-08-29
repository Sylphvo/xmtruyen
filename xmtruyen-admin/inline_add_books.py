import os

def add_inline_add(filepath, type_name, default_status, fields, title, entity_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("import { Dropdown, Form } from 'react-bootstrap';", "import { Dropdown, Form, Button } from 'react-bootstrap';")
    content = content.replace("faAngleDoubleRight }", "faAngleDoubleRight, faPlus }")

    state_code = """
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<TYPE_NAME>>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, saveFunc: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    }
  };

  const handleCloseAdd = () => {
    setIsAddingNew(false);
    setNewItem({});
  };

  const handleAddSubmit = () => {
    const newEntry: any = {
      id: Math.random().toString(36).substr(2, 9),
      ...newItem,
      status: 'DEFAULT_STATUS'
    };
    setData([newEntry, ...data]);
    handleCloseAdd();
  };
""".replace('TYPE_NAME', type_name).replace('DEFAULT_STATUS', default_status)

    content = content.replace("  const [sortConfig", state_code + "\n  const [sortConfig")

    header_search = """      <div className="card-header border-bottom-0 pt-4 pb-0" style={{ backgroundColor: 'transparent' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>TITLE</h5>
      </div>""".replace('TITLE', title)
      
    header_repl = """      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>TITLE</h5>
        <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm Mới
        </Button>
      </div>""".replace('TITLE', title)
      
    content = content.replace(header_search, header_repl)

    tds = ""
    for field in fields:
        if field['name'] == 'cover_title':
            tds += """
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src="https://via.placeholder.com/32x48" alt="New" className="rounded" style={{ width: '32px', height: '48px', objectFit: 'cover' }} />
                      <Form.Control size="sm" value={newItem.title || ''} onChange={(e) => setNewItem({...newItem, title: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="Title" className="bg-transparent text-body border-secondary-subtle" />
                    </div>
                  </td>"""
        elif field['name'] == 'status':
            tds += """
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="badge bg-light text-dark border border-secondary-subtle">DEFAULT_STATUS</span>
                  </td>""".replace('DEFAULT_STATUS', default_status)
        else:
            if field.get('type') == 'date':
                tds += """
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control size="sm" type="date" value={newItem.FIELD_NAME || ''} onChange={(e) => setNewItem({...newItem, FIELD_NAME: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} className="bg-transparent text-body border-secondary-subtle" />
                  </td>""".replace('FIELD_NAME', field['name'])
            else:
                tds += """
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control size="sm" value={newItem.FIELD_NAME || ''} onChange={(e) => setNewItem({...newItem, FIELD_NAME: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="PLACEHOLDER" className="bg-transparent text-body border-secondary-subtle" />
                  </td>""".replace('FIELD_NAME', field['name']).replace('PLACEHOLDER', field['placeholder'])

    new_row = """              <>
              {isAddingNew && (
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  TDS
                  <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button variant="success" size="sm" onClick={handleAddSubmit} className="px-3 rounded-2 fw-medium">Lưu</Button>
                      <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                    </div>
                  </td>
                </tr>
              )}
""".replace("TDS", tds)

    content = content.replace("            <tbody>\n              {paginatedData.length > 0 ? (", "            <tbody>\n" + new_row + "              {paginatedData.length > 0 ? (")

    content = content.replace("                  </tr>\n                ))\n              ) : (", "                  </tr>\n                ))\n              )}</>\n              ) : (")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

add_inline_add(
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Books.tsx',
    'IBook', 'New',
    [
        {'name': 'cover_title'},
        {'name': 'author', 'type': 'text', 'placeholder': 'Author'},
        {'name': 'category', 'type': 'text', 'placeholder': 'Category'},
        {'name': 'published', 'type': 'text', 'placeholder': 'YYYY'},
        {'name': 'status'}
    ],
    'Quản lý Sách', 'Book'
)

add_inline_add(
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Topics.tsx',
    'ITopic', 'Active',
    [
        {'name': 'name', 'type': 'text', 'placeholder': 'Name'},
        {'name': 'description', 'type': 'text', 'placeholder': 'Description'},
        {'name': 'createdAt', 'type': 'date', 'placeholder': ''},
        {'name': 'status'}
    ],
    'Quản lý Topic', 'Topic'
)

add_inline_add(
    r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Categories.tsx',
    'ICategory', 'Active',
    [
        {'name': 'name', 'type': 'text', 'placeholder': 'Name'},
        {'name': 'description', 'type': 'text', 'placeholder': 'Description'},
        {'name': 'createdAt', 'type': 'date', 'placeholder': ''},
        {'name': 'status'}
    ],
    'Quản lý Category', 'Category'
)
