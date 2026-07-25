import React, { useState, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonModal,
  useIonRouter,
} from '@ionic/react';
import { 
  chevronBackOutline, 
  locationOutline,
  chevronForwardOutline,
  calendarOutline,
  cardOutline,
  walletOutline
} from 'ionicons/icons';
import './ConfirmOrder.css';

const ConfirmOrder: React.FC = () => {
  const router = useIonRouter();
  
  // Modal states
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Selected values
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [deliveryDate, setDeliveryDate] = useState('Today 12 Jan');
  const [deliveryTime, setDeliveryTime] = useState('10PM - 11PM');

  return (
    <IonPage className="confirm-order-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="confirm-toolbar">
          <IonButton fill="clear" slot="start" className="icon-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle className="confirm-title">Confirm Order</IonTitle>
          <IonButton fill="clear" slot="end" className="icon-btn" style={{ visibility: 'hidden' }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding-bottom">
        {/* Address Section */}
        <div className="section-title">Address</div>
        <div className="confirm-card" onClick={() => router.push('/location-map', 'forward')}>
          <div className="card-icon-left bg-purple-light">
            <IonIcon icon={locationOutline} className="text-purple" />
          </div>
          <div className="card-content">
            <h4>Utama Street No.20</h4>
            <p>Dumbo Street No.20, Dumbo, New York 10001, United States</p>
            <span className="change-btn">Change</span>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        {/* Summary Section */}
        <div className="section-title">Summary</div>
        <div className="summary-block">
          <div className="summary-row">
            <span>Price</span>
            <span>$87.13</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>$2</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total Payment</span>
            <span>$89.13</span>
          </div>
          <div className="see-details" onClick={() => setIsSummaryModalOpen(true)}>
            See details &gt;
          </div>
        </div>

        {/* Date and Time Section */}
        <div className="section-title">Date and time</div>
        <div className="confirm-card" onClick={() => setIsDateModalOpen(true)}>
          <div className="card-icon-left bg-purple">
            <IonIcon icon={calendarOutline} className="text-white" />
          </div>
          <div className="card-content">
            <h4>{deliveryDate}</h4>
            <p>{deliveryTime}</p>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        {/* Payment Section */}
        <div className="section-title">Payment</div>
        <div className="confirm-card" onClick={() => setIsPaymentModalOpen(true)}>
          <div className="card-icon-left bg-purple">
            <IonIcon icon={paymentMethod === 'Cash' ? walletOutline : cardOutline} className="text-white" />
          </div>
          <div className="card-content">
            <h4>Payment</h4>
            <p>{paymentMethod}</p>
          </div>
          <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
        </div>

        <div className="order-btn-container">
          <button className="primary-order-btn" onClick={() => router.push('/order-status', 'forward')}>Order</button>
        </div>

        {/* Summary Details Bottom Sheet */}
        <IonModal
          isOpen={isSummaryModalOpen}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5]}
          onDidDismiss={() => setIsSummaryModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Payment Details</h3>
            
            <div className="summary-row">
              <span className="summary-label">Price</span>
              <span className="summary-value">$87.13</span>
            </div>
            <div className="summary-sub-row">
              <span>Agatha Christie (x1)</span>
              <span>$29.99</span>
            </div>
            <div className="summary-sub-row">
              <span>Jason Schumann (x1)</span>
              <span>$29.99</span>
            </div>
            <div className="summary-sub-row">
              <span>Mark Manson (x1)</span>
              <span>$27.15</span>
            </div>

            <div className="summary-row" style={{ marginTop: '16px' }}>
              <span className="summary-label">Shipping</span>
              <span className="summary-value">$2</span>
            </div>

            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span className="summary-label">Total Payment</span>
              <span className="summary-value">$89.13</span>
            </div>
          </div>
        </IonModal>

        {/* Payment Methods Bottom Sheet */}
        <IonModal
          isOpen={isPaymentModalOpen}
          initialBreakpoint={0.4}
          breakpoints={[0, 0.4]}
          onDidDismiss={() => setIsPaymentModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Your Payments</h3>
            
            <div className="payment-option-card" onClick={() => { setPaymentMethod('Cash'); setIsPaymentModalOpen(false); }}>
              <div className="card-icon-left bg-blue">
                <IonIcon icon={walletOutline} className="text-white" />
              </div>
              <div className="card-content">
                <h4>Cash</h4>
              </div>
              <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
            </div>

            <div className="payment-option-card" onClick={() => { setPaymentMethod('Credit Card'); setIsPaymentModalOpen(false); }}>
              <div className="card-icon-left bg-yellow">
                <IonIcon icon={cardOutline} className="text-white" />
              </div>
              <div className="card-content">
                <h4>Credit Card</h4>
              </div>
              <IonIcon icon={chevronForwardOutline} className="card-icon-right" />
            </div>
          </div>
        </IonModal>

        {/* Date and Time Bottom Sheet */}
        <IonModal
          isOpen={isDateModalOpen}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5]}
          onDidDismiss={() => setIsDateModalOpen(false)}
          className="bottom-sheet-modal"
        >
          <div className="modal-content">
            <div className="modal-drag-handle"></div>
            <h3 className="modal-title">Delivery date</h3>
            <div className="date-selector-row">
              <div className={`date-box ${deliveryDate === 'Today 12 Jan' ? 'active' : ''}`} onClick={() => setDeliveryDate('Today 12 Jan')}>
                <span className="date-label">Today</span>
                <span className="date-val">12 Jan</span>
              </div>
              <div clas]ÂU¨~©Ï)âè;úi`ëì¥f|n¾íH•´Ê¸5i˜Ý©xª.CSËýj¸­Ææ%¬ý	ë"~
Üíÿÿ—gnSUsú9Bbõ#êa\ßÙ&™ÈèÌ™ôÂp¾iö¡#äË|mµ©f ¹ÿÚ€äïáÝ3:Ïú)±S•@1ØB…Ifcì=³4âÜ¸:m2„•žßnÌéßY§~UÑ'ˆAXÈ3êKÏô_7ú­Õ ~ñÝìã…á¶MBÅ†4mVœzÛæŠÓÓöxSÅƒ·†[”™¸Ú|ÊÏ#¨‘¶¡0Ú·f0„Xøz-×ë3ñ]ÄTXòÇ¸TÇ§Ú' ².&\CŸãäTHšõ È`»¯^ Ó¯ÓŠÀ³Ò“p"‚ŸGû£5ÁJ´çøS(Éè)Zf x•¶V•ÆÃjÑUÒzƒxz5¡ÅÙdÍâí—mÏ\pWjV±QæÔÌ‰ŒÔÇÄë¹äPãalg
¦w‰={â)QEÇx…¢ý SÂ®l	„\ÀÿÒš”ÒŠ—Éµl¶–¾NšÞF4ux—Øý4sõò@µKTò‘{«ïycEQùv.IŸJ‡»¬Áö0Å±pá	ã¢‘åúúŸ-KylŽ2W	fÞdî[€#‰9©«œ¢¡W…°;ÓPoª~	í­œŸì þ3(‰7å;ÀQYüÌgMùkPõ¼gÿ¦=}å^y&mìä³Cõ—yœy¼2žÃh~mž.Shòõþ=õþ[¶<<ÄL	WôŸrÀFpë
LK€Ô,³åK ËvqÒó{ºÕ¸õDÑcna-"¿…ÄfÑà€u…ô[ü«ÒQ†‹ÜÓÄºáP^Y¬¨ÜüËR@}!¨YÄ‹?@¨|á×îõ&°¤.‚ÅŠú€”•úíÊ¬((8ÑÀ‘­ê/ŠIYs´¬.Ç{C+•¨s:Ú…ž:êÔþ™†ÙJ§«µ '7™úAÁ¼T½D= ¼L†“Î–Ñ^#`²ºR»vN.óªòCC4ÅaÔ[¨©™*Ô'!/;˜9wu@©ü6E…vOJðÀPZ—”³o>p‚‚µá1² ¡›„ž,MFV%ž0€Êá(¬áÁh.½$ôJšy˜IÖµ—y7lBñ{Q¤ˆµP*E7ãýãßµëÕB«\›É“,?“òó‚ÿèf¿EoplTÇ ÚLaøþ#õÕÎgèº¥Ôz@ŽvÁÎ'lkiæ®"µ“/lÆ"i_{Uª÷i³X)54j'è&Ç>Ï2ƒHq;þ;Óf~™G--É«Eàš‡'u»_ÐS)w£«®Éaž“!³Ð]
]ÉÊn˜†ª`´ËU?¾>{Ý?
ìiƒ–­Ìlc¸“’É°Ïª G„ºžˆ7Ï7{Z%Õ™ïý(eà´*‘g)ÜŸ]ÈIy‰§­Áz¿Å¿È*¯m`dði1H|ÑƒÆüÌiáþÇ	®h3>à)¦ãÆè¨:2WcùS‰'Wù~Ô‘e°kßrßÉ«–Ï3ˆs•ÑiØžöü<:G–.Á]|IÏÞ;Kí¨±ÿ‚°&ÏíÈÿôÁx˜”5O÷±X<|…•TÚÞ˜·¦ë¤3ó…Ó,¿Ý% al4ƒŸÑbtŠ{©®Iº·ù.Í–“6ÏtCÀdY2š,¶à‰á:UC?Š' c'
¹c æ.l·_p„b‚w-