import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import MainTabs from './components/MainTabs';
import Onboarding from './pages/Onboarding';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerificationEmail from './pages/VerificationEmail';
import PhoneInput from './pages/PhoneInput';
import VerificationPhone from './pages/VerificationPhone';
import Success from './pages/Success';

import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordEmail from './pages/ResetPasswordEmail';
import ResetPasswordPhone from './pages/ResetPasswordPhone';
import ResetVerifyEmail from './pages/ResetVerifyEmail';
import ResetVerifyPhone from './pages/ResetVerifyPhone';
import NewPassword from './pages/NewPassword';
import PasswordChanged from './pages/PasswordChanged';
import VendorsList from './pages/VendorsList';
import AuthorsList from './pages/AuthorsList';
import AuthorDetail from './pages/AuthorDetail';
import BookDetail from './pages/BookDetail';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import ConfirmOrder from './pages/ConfirmOrder';
import LocationMap from './pages/LocationMap';
import LocationForm from './pages/LocationForm';
import OrderStatus from './pages/OrderStatus';
import OrderReceived from './pages/OrderReceived';
import PromotionDetail from './pages/PromotionDetail';
import MyAccount from './pages/MyAccount';
import Favorites from './pages/Favorites';
import OrderHistory from './pages/OrderHistory';
import HelpCenter from './pages/HelpCenter';
import Offers from './pages/Offers';
import ReadBook from './pages/ReadBook';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/onboarding">
          <Onboarding />
        </Route>
        <Route exact path="/signin">
          <SignIn />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/verification-email">
          <VerificationEmail />
        </Route>
        <Route exact path="/phone-input">
          <PhoneInput />
        </Route>
        <Route exact path="/verification-phone">
          <VerificationPhone />
        </Route>
        <Route exact path="/success">
          <Success />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route exact path="/reset-email">
          <ResetPasswordEmail />
        </Route>
        <Route exact path="/reset-phone">
          <ResetPasswordPhone />
        </Route>
        <Route exact path="/reset-verify-email">
          <ResetVerifyEmail />
        </Route>
        <Route exact path="/reset-verify-phone">
          <ResetVerifyPhone />
        </Route>
        <Route exact path="/new-password">
          <NewPassword />
        </Route>
        <Route exact path="/password-changed">
          <PasswordChanged />
        </Route>

        {/* Tab based routes */}
        <Route path="/tabs">
          <MainTabs />
        </Route>
        <Route exact path="/home">
          <Redirect to="/tabs/home" />
        </Route>

        {/* Detail and List routes */}
        <Route exact path="/vendors">
          <VendorsList />
        </Route>
        <Route exact path="/authors">
          <AuthorsList />
        </Route>
        <Route exact path="/author-detail/:id">
          <AuthorDetail />
        </Route>
        <Route exact path="/book-detail/:id">
          <BookDetail />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/notifications">
          <Notifications />
        </Route>
        <Route exact path="/confirm-order">
          <ConfirmOrder />
        </Route>
        <Route exact path="/location-map">
          <LocationMap />
        </Route>
        <Route exact path="/location-form">
          <LocationForm />
        </Route>
        <Route exact path="/order-status">
          <OrderStatus />
        </Route>
        <Route exact path="/order-received">
          <OrderReceived />
        </Route>
        <Route exact path="/promotion-detail">
          <PromotionDetail />
        </Route>
        <Route exact path="/my-account">
          <MyAccount />
        </Route>
        <Route exact path="/favorites">
          <Favorites />
        </Route>
        <Route exact path="/order-history">
          <OrderHistory />
        </Route>
        <Route exact path="/help-center">
          <HelpCenter />
        </Route>
        <Route exact path="/offers">
          <Offers />
        </Route>
        <Route exact path="/read-book/:id">
          <ReadBook />
        </Route>

        <Route exact path="/">
          <Redirect to="/onboarding" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
