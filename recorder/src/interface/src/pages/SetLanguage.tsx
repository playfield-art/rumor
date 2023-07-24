import React, { useRef } from 'react'
import { useControl } from '../hooks/useControl'
import { SwiperClass, SwiperSlide, Swiper } from 'swiper/react'
import 'swiper/css';
import { styled } from 'styled-components';
import { InformationBox } from '../components/InformationBox';
import { Page } from './Layouts/Page';
import { ControlBoxFixed } from '../components/ControlBoxFixed';
import { useNavigate } from 'react-router-dom';
import { useTranslationsStore } from '../hooks/useTranslationsStore';
import translationsInSetup from '../translations';

const SwiperSlideLanguage = styled(SwiperSlide)`
  background-color: none;
  color: var(--white);
  text-align: center;
  font-size: 4.5rem;
`

export const SetLanguage = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperClass>();
  const translations = useTranslationsStore((state) => state.translations)
  const changeTranslations = useTranslationsStore((state) => state.changeTranslations);

  /**
   * When the left button is pressed, we want to scroll to the previous item
   */
  const onLeftButtonPressed = () => {
    swiperRef.current?.slidePrev()
  }

  /**
   * When the middle button is pressed, activate the language
   */
  const onMiddleButtonPressed = () => {
    // @todo: set the language in backend

    // set the language in the frontend
    const enIndex = Object.keys(translationsInSetup).findIndex((language) => language === 'en');
    const selectedLanguage = Object.keys(translationsInSetup)[swiperRef.current?.activeIndex ?? enIndex];
    changeTranslations(selectedLanguage.value);

    // navigate to count down
    navigate('/start-countdown');
  }

  /**
   * When the right button is pressed, we want to scroll to the next item
   */
  const onRightButtonPressed = () => {
    swiperRef.current?.slideNext()
  }

  // Use the control hook
  useControl({ onLeftButtonPressed, onMiddleButtonPressed, onRightButtonPressed });

  return (
    <Page>
      <InformationBox text={translations.pleaseSelectYourLanguage} />
      <div style={{
        minWidth: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Swiper
          slidesPerView={1}
          loop
          onSwiper={(swiper) => swiperRef.current = swiper}
        >
          {Object.keys(translationsInSetup).map((language) => (
            <SwiperSlideLanguage key={language}>
              <div>{translationsInSetup[language as keyof typeof translationsInSetup].language}</div>
            </SwiperSlideLanguage>
          ))}
        </Swiper>
      </div>
      <ControlBoxFixed />
    </Page>
  )
}