import React from 'react';
import { IonIcon } from '@ionic/react';
import { backspaceOutline } from 'ionicons/icons';
import './CustomKeypad.css';

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const CustomKeypad: React.FC<CustomKeypadProps> = ({ onKeyPress, onDelete }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="custom-keypad-container">
      <div className="keypad-grid">
        {keys.map((key) => (
          <div key={key} className="keypad-btn" onClick={() => onKeyPress(key)}>
            {key}
          </div>
        ))}
        <div className="keypad-btn delete-btn" onClick={onDelete}>
          <IonIcon icon={backspaceOutline} />
        </div>
      </div>
    </div>
  );
};

export default CustomKeypad;
