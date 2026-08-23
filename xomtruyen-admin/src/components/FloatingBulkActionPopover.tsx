import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';

interface FloatingBulkActionPopoverProps {
  title: string;
  options: { label: string; value: string }[];
  onCancel: () => void;
  onSubmit: (selectedValue: string, notify: boolean) => void;
}

export const FloatingBulkActionPopover: React.FC<FloatingBulkActionPopoverProps> = ({
  title,
  options,
  onCancel,
  onSubmit
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [notify, setNotify] = useState(false);

  // Monochrome dark theme for the select box (Jira-like)
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#22272B',
      borderColor: state.isFocused ? '#4C9AFF' : '#A6C5E229',
      color: '#B6C2CF',
      boxShadow: state.isFocused ? '0 0 0 1px #4C9AFF' : 'none',
      '&:hover': {
        borderColor: '#A6C5E229'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#B6C2CF'
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#282E33',
      border: '1px solid #A6C5E229',
      boxShadow: '0 4px 11px rgba(9,30,66,0.25)'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#A6C5E229' : 'transparent',
      color: '#B6C2CF',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#4C9AFF',
        color: '#FFFFFF'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: '#B6C2CF'
    }),
    indicatorSeparator: () => ({ display: 'none' })
  };

  return (
    <>
      <div 
        className="shadow-lg popover-bulk-action"
        style={{
          position: 'fixed',
          bottom: '96px', // Hover just above the 40px + 40px action bar
          left: 'calc(50% + 140px)',
          transform: 'translateX(-50%)',
          backgroundColor: '#22272B',
          color: '#B6C2CF',
          borderRadius: '8px',
          padding: '16px',
          width: '380px',
          zIndex: 1060,
          boxShadow: '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08)'
        }}
      >
      <h6 className="mb-3 fw-bold text-white" style={{ fontSize: '14px' }}>{title}</h6>
      
      <div className="mb-3">
        <Select
          options={options}
          styles={customStyles}
          placeholder="Select an option"
          onChange={(val: any) => setSelectedValue(val?.value || null)}
          isClearable
        />
      </div>

      <Form.Check 
        type="checkbox"
        id={`notify-checkbox-${title.replace(/\s+/g, '-')}`}
        label="Send a notification for work items that are affected by this bulk action."
        className="mb-4"
        style={{ fontSize: '13px' }}
        checked={notify}
        onChange={(e) => setNotify(e.target.checked)}
      />

      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="link" 
          className="text-decoration-none" 
          style={{ color: '#B6C2CF', fontWeight: 500, fontSize: '14px' }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          style={{ 
            backgroundColor: selectedValue ? '#579DFF' : '#A6C5E229', 
            borderColor: 'transparent',
            color: selectedValue ? '#1D2125' : '#8C9BAB',
            fontWeight: 500,
            fontSize: '14px'
          }}
          disabled={!selectedValue}
          onClick={() => {
            if (selectedValue) {
              onSubmit(selectedValue, notify);
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
    </>
  );
};
