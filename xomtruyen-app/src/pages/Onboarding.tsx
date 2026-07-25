import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/pagination';
import './Onboarding.css';

const Onboarding: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const swiperRef = useRef<SwiperCore>();
  const router = useIonRouter();

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    router.push('/signin', 'forward', 'replace');
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.push('/signin', 'forward', 'replace');
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <IonPage className="onboarding-page">
      <IonContent fullscreen scrollY={true}>
        {/* Splash Screen */}
        <div className={`splash-screen ${!showSplash ? 'hidden' : ''}`}>
          <div className="splash-logo">
            <svg className="splash-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple generic cross/plus icon similar to screenshot */}
              <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7L17 17M7 17L17 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
            </svg>
            <h1 className="splash-text">Xóm Truyện</h1>
          </div>
        </div>

        {/* Onboarding Content */}
        <div className="onboarding-container">
          <div className="skip-header">
            <IonButton fill="clear" className="skip-button" onClick={handleSkip}>
              Skip
            </IonButton>
          </div>

          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setIsLastSlide(swiper.isEnd);
            }}
            className="swiper-container"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="slide-content">
                <div className="illustration-container">
                  <svg className="illustration" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="20" width="200" height="160" rx="10" fill="#f0eefa" />
                    <circle cx="150" cy="100" r="40" fill="#513b86" opacity="0.2" />
                    <rect x="110" y="80" width="80" height="40" rx="5" fill="#513b86" />
                    <text x="150" y="140" textAnchor="middle" fill="#513b86" fontSize="14" fontWeight="bold">Reading Books</text>
                  </svg>
                </div>
                <div className="text-container">
                  <h2 className="slide-title">Now reading books<br />will be easier</h2>
                  <p className="slide-description">
                    Discover new worlds, join a vibrant reading community. Start your reading adventure effortlessly with us.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="slide-content">
                <div className="illustration-container">
                  <svg className="illustration" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="20" width="200" height="160" rx="10" fill="#f0eefa" />
                    <circle cx="150" cy="100" r="40" fill="#513b86" opacity="0.2" />
                    <path d="M130 100 L150 120 L180 80" stroke="#513b86" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="150" y="150" textAnchor="middle" fill="#513b86" fontSize="14" fontWeight="bold">Soulmate Awaits</text>
                  </svg>
                </div>
                <div className="text-container">
                  <h2 className="slide-title">Your Bookish Soulmate<br />Awaits</h2>
                  <p className="slide-description">
                    Let us be your guide to the perfect read. Discover books tailored to your tastes for a truly rewarding experience.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <div className="slide-content">
                <div className="illustration-container">
                  <svg className="illustration" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="20" width="200" height="160" rx="10" fill="#f0eefa" />
                    <circle cx="150" cy="100" r="40" fill="#513b86" opacity="0.2" />
                    <path d="M120 100 L180 100 M160 80 L180 100 L160 120" stroke="#513b86" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="150" y="160" textAnchor="middle" fill="#513b86" fontSize="14" fontWeight="bold">Start Adventure</text>
                  </svg>
                </div>
                <div className="text-container">
                  <h2 className="slide-title">Start Your<br />Adventure</h2>
                  <p className="slide-description">
                    Ready to embark on a quest for inspiration and knowledge? Your adventure begins now. Let's go!
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <div className="bottom-actions">
            <IonButton expand="block" className="btn-primary" onClick={handleNext}>
              {isLastSlide ? 'Get Started' : 'Continue'}
            </IonButton>
            <IonButton expand="block" fill="clear" className="btn-secondary" onClick={() => router.push('/signin', 'forward', 'replace')}>
              Sign in
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
