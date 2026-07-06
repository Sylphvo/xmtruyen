import os

file_path = r'c:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xomtruyen-admin\src\pages\Users.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isAddingNewUser state
content = content.replace(
    'const [showAddModal, setShowAddModal] = useState(false);',
    'const [isAddingNewUser, setIsAddingNewUser] = useState(false);'
)

# 2. Add handleKeyDown method inside Users component right after states
key_down_func = """
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>, saveFunc: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    }
  };
"""
content = content.replace(
    '// Debounce search term',
    key_down_func + '\n  // Debounce search term'
)

# 3. Replace handleCloseAddModal
content = content.replace(
    """  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUser({ email: '', password: '', fullName: '', isActive: true, coinBalance: 0 });
  };""",
    """  const handleCloseAdd = () => {
    setIsAddingNewUser(false);
    setNewUser({ email: '', password: '', fullName: '', isActive: true, coinBalance: 0 });
  };"""
)

# 4. Replace handleAddSubmit signature and modal logic
content = content.replace(
    'const handleAddSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();',
    'const handleAddSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {\n    if (e) e.preventDefault();'
)
content = content.replace(
    'handleCloseAddModal();',
    'handleCloseAdd();'
)
content = content.replace(
    """    if (!newUser.email) return;""",
    """    if (!newUser.email) {\n      alert('Email là bắt buộc');\n      return;\n    }"""
)


# 5. Change Add button click handler
content = content.replace(
    'onClick={() => setShowAddModal(true)}',
    'onClick={() => setIsAddingNewUser(true)}'
)

# 6. Add new row to table
new_row_jsx = """              {isAddingNewUser && (
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName || newUser.email || 'U')}&background=random`} 
                        alt="New User" 
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                      />
                      <Form.Control 
                        size="sm" 
                        value={newUser.fullName || ''} 
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} 
                        onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit())}
                        placeholder="Họ tên"
                        className="bg-transparent text-body border-secondary-subtle"
                      />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control 
                      size="sm" 
                      value={newUser.email || ''} 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit())}
                      placeholder="Email"
                      className="bg-transparent text-body border-secondary-subtle"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="badge bg-light text-dark border border-secondary-subtle">Local</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control 
                      size="sm" 
                      type="number" 
                      value={newUser.coinBalance ?? 0} 
                      onChange={(e) => setNewUser({...newUser, coinBalance: Number(e.target.value)})} 
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit())}
                      style={{ width: '90px' }}
                      className="bg-transparent text-warning fw-bold border-secondary-subtle"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="text-muted small">Free</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="fw-medium">0</span> / <span className="text-muted small">0</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    -
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Check 
                      type="switch"
                      id="add-status"
                      checked={newUser.isActive ?? true}
                      onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit())}
                      className="d-inline-block"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button variant="success" size="sm" onClick={() => handleAddSubmit()} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                      <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                    </div>
                  </td>
                </tr>
              )}
"""
content = content.replace(
    ') : sortedData.length > 0 ? (',
    ') : (\n                <>\n' + new_row_jsx + '              {sortedData.length > 0 ? ('
)

# 7. Close the fragment at the end of the data section
content = content.replace(
    """                  )
                ))
              ) : (""",
    """                  )
                ))
              ) : ("""
) # wait, I just wrapped the true condition in `<>`, I need to close the `</>` right after the `.map` finishes!
content = content.replace(
    '                ))\n              ) : (',
    '                ))\n              )}</>\n              ) : ('
)

# 8. Add onKeyDown to existing edit inputs
content = content.replace(
    'onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} \n                            placeholder="Họ tên"',
    'onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} \n                            onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id))}\n                            placeholder="Họ tên"'
)
content = content.replace(
    'onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} \n                          placeholder="Email"',
    'onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} \n                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id))}\n                          placeholder="Email"'
)
content = content.replace(
    'onChange={(e) => setEditFormData({...editFormData, coinBalance: Number(e.target.value)})} \n                          style={{ width: \'90px\' }}',
    'onChange={(e) => setEditFormData({...editFormData, coinBalance: Number(e.target.value)})} \n                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id))}\n                          style={{ width: \'90px\' }}'
)
content = content.replace(
    'onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}\n                          className="d-inline-block"',
    'onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}\n                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id))}\n                          className="d-inline-block"'
)

# 9. Remove Modal from JSX completely
import re
content = re.sub(r'\{/\* Modal Thêm User \*/\}.*?</Modal>', '', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
