import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { chevronBackOutline, locateOutline } from 'ionicons/icons';
import './LocationForm.css';

const LocationForm: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="location-form-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="location-form-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="location-form-title">Location</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn text-purple">
            <IonIcon icon={locateOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="form-group">
          <label>Phone</label>
          <input type="text" className="custom-input" placeholder="Phone" />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" className="custom-input" placeholder="Name" />
        </div>

        <div className="form-group">
          <label>Governorate</label>
          <input type="text" className="custom-input" placeholder="Governorate" />
        </div>

        <div className="form-group">
          <label>City</label>
          <input type="text" className="custom-input" placeholder="City" />
        </div>

        <div className="form-group">
          <label>Block</label>
          <input type="text" className="custom-input" placeholder="Block" />
        </div>

        <div className="form-group">
          <label>Street name/number</label>
          <input type="text" className="custom-input" placeholder="Street name/number" />
        </div>

        <div className="form-group">
          <label>Building name/number</label>
          <input type="text" className="custom-input" placeholder="Building name/number" />
        </div>

        <div className="form-group">
          <label>Floor (option)</label>
          <input type="text" className="custom-input" placeholder="Floor (option)" />
        </div>
        
        <div className="form-group">
          <label>Flat(option)</label>
          <input type="text" className="custom-input" placeholder="Flat(option)" />
        </div>

        <div className="form-group">
          <label>Avenue (option)</label>
          <input type="text" className="custom-input" placeholder="Avenue (option)" />
        </div>

        <button className="primary-order-btn mt-24 mb-24" onClick={() => router.goBack()}>Confirmation</button>
      </IonContent>
    </IonPage>
  );
};

export default LocationForm;
