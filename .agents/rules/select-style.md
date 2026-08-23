---
name: Select Box Jira Style
description: Guidelines for styling and implementing select boxes (dropdowns) in the XomTruyen Admin Panel.
---

# Select Box Jira Style Rule

In the XomTruyen Admin Panel, all select boxes (dropdown menus) must follow the Jira-inspired design language (e.g., light gray borders, specific hover/focus states, and a custom caret icon).

## Guidelines for Implementing Select Boxes

To ensure visual consistency, the global stylesheet (`app.scss`) has been configured to automatically apply these styles to default HTML `<select>` elements and `react-select` components. Follow these rules when adding or modifying select boxes:

### 1. Simple Dropdowns (Native Select)
For basic single-selection dropdowns without search functionality, always use the native HTML `<select>` element with the Bootstrap `.form-select` class (or `<Form.Select>` from `react-bootstrap`).

**Correct usage:**
```tsx
import { Form } from 'react-bootstrap';

// The global CSS will automatically apply the Jira-style to .form-select
<Form.Select value={value} onChange={handleChange}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Form.Select>
```

**Avoid:**
- Do not use inline styles to override borders or backgrounds (e.g., `style={{ border: '1px solid black' }}`).
- Do not use the `react-bootstrap` `Dropdown` component for standard forms unless you need complex custom rendering inside the menu (like the "Loại Sách" column in the Books table).

### 2. Complex Dropdowns (React Select)
For multi-select dropdowns, searchable dropdowns, or dropdowns with custom option labels, use the `react-select` library.

**Correct usage:**
```tsx
import Select from 'react-select';

// The global CSS will automatically target the default react-select classes
// like .css-1s2u09g-control, .css-1n7v3ny-option, etc.
<Select
  options={options}
  value={selectedValue}
  onChange={handleChange}
  isMulti={false}
/>
```

**Avoid:**
- Do not pass a highly customized `styles` prop to `react-select` that overrides background colors, borders, or hover states. The global CSS in `app.scss` is already designed to handle this. If you must use the `styles` prop, only use it for layout/sizing adjustments (e.g., `minWidth`), NOT for colors or borders.

### 3. Key Visual Characteristics (Do Not Override)
- **Background**: `var(--bg-main)`
- **Text Color**: `var(--jira-text)`
- **Border**: `1px solid var(--jira-border)`
- **Hover State**: `var(--jira-hover-bg)`
- **Active/Focus State**: Border color `#4c9aff`
- **Selected Option (in React Select)**: Background `#e9f2ff`, Text/Border-left `#0c66e4`

If you encounter a select box that does not match this style, remove any conflicting inline styles or custom CSS classes, and ensure it uses the standard `.form-select` class or `react-select` component.
