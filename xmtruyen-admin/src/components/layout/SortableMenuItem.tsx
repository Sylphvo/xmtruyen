import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavLink } from 'react-router-dom';
import { GripVertical } from 'lucide-react';

interface SortableMenuItemProps {
  id: string;
  path: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  isActive?: boolean;
  end?: boolean;
  isDivider?: boolean;
}

export const SortableMenuItem: React.FC<SortableMenuItemProps> = ({
  id,
  path,
  icon: Icon,
  title,
  subtitle,
  isActive,
  end,
  isDivider
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  };

  if (isDivider) {
    return (
      <div ref={setNodeRef} style={{ ...style, display: 'flex', alignItems: 'center', padding: '15px 20px 5px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--bs-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', marginRight: '5px', opacity: 0.5 }}>
          <GripVertical size={14} />
        </div>
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="d-flex align-items-center w-100 pr-2">
      <div 
        {...attributes} 
        {...listeners} 
        style={{ cursor: 'grab', padding: '10px 5px 10px 15px', color: '#6c757d', display: 'flex', alignItems: 'center' }}
        title="Kéo để di chuyển"
      >
        <GripVertical size={16} />
      </div>
      <NavLink 
        to={path} 
        className={({ isActive: defaultActive }) => `menu-link flex-grow-1${isActive || defaultActive ? ' active' : ''}`} 
        end={end}
        style={{ paddingLeft: '5px' }}
      >
        <Icon size={18} />
        <span>{title} {subtitle && <span className="text-secondary small" style={{ fontSize: '12px' }}>{subtitle}</span>}</span>
      </NavLink>
    </div>
  );
};
