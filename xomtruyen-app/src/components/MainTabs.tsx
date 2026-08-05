import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { home, gridOutline, cartOutline, personOutline } from 'ionicons/icons';

import Home from '../pages/Home';
import Category from '../pages/Category';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home">
          <Home />
        </Route>
        <Route exact path="/tabs/category">
          <Category />
        </Route>
        <Route exact path="/tabs/cart">
          <Cart />
        </Route>
        <Route exact path="/tabs/profile">
          <Profile />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" style={{ '--background': '#ffffff', borderTop: 'none', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
        <IonTabButton tab="home" href="/tabs/home" style={{ '--color-selected': '#513b86' }}>
          <IonIcon icon={home} />
          <IonLabel style={{ fontSize: '10px' }}>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="category" href="/tabs/category" style={{ '--color-selected': '#513b86' }}>
          <IonIcon icon={gridOutline} />
          <IonLabel style={{ fontSize: '10px' }}>Category</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cart" href="/tabs/cart" style={{ '--color-selected': '#513b86' }}>
          <IonIcon icon={cartOutline} />
          <IonLabel style={{ fontSize: '10px' }}>Cart</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile" style={{ '--color-selected': '#513b86' }}>
          <IonIcon icon={personOutline} />
          <IonLabel style={{ fontSize: '10px' }}>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
