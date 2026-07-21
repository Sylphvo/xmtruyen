import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const ActionCellRenderer = (params: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center h-100 position-relative" ref={menuRef}>
      <button 
        className="btn btn-icon bg-transparent text-muted p-0" 
        style={{ width: '32px', height: '32px', border: '1px solid var(--app-border-color)', borderRadius: '4px', backgroundColor: isOpen ? 'var(--app-hover-bg)' : 'transparent' }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)'}
        onMouseOut={e => { if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        ...
      </button>
      {isOpen && (
        <div className="position-absolute end-0 rounded-3 shadow-sm border" style={{ top: '100%', minWidth: '120px', zIndex: 9999, backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-color)' }}>
          <div className="py-1">
            <button className="dropdown-item px-3 py-2 text-start w-100 border-0 bg-transparent" style={{ fontSize: '13px', color: 'var(--app-text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => { setIsOpen(false); toast('Edit clicked for ' + params.data.name) }}>
              Edit
            </button>
            <button className="dropdown-item px-3 py-2 text-start w-100 border-0 bg-transparent" style={{ fontSize: '13px', color: 'var(--app-text-main)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => { setIsOpen(false); toast('Delete clicked for ' + params.data.name) }}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
