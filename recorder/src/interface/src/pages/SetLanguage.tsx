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
import { interfaceTranslations } from '../translations';
import { useSocket } from '../hooks/useSocket';

const SwiperSlideLanguage = styled(SwiperSlide)`
  background-color: none;
  color: var(--white);
  text-align: center;
  font-size: 4.5rem;
`

export const SetLanguage = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperClass>();
  const [instructions, setInstructions] = React.useState<string>(interfaceTranslations.en.pleaseSelectYourLanguage);
  const changeTranslations = useTranslationsStore((state) => state.changeTranslations);
  const { sendToServer } = useSocket();

  /**
   * When the left button is pressed, we want to scroll to the previous item
   */
  const onLeftButtonPressed = () => {
    swiperRef.current?.slidePrev();
    const selectedLanguageKey = getSelectedLanguageKey();
    setInstructions(interfaceTranslations[selectedLanguageKey as keyof typeof interfaceTranslations].pleaseSelectYourLanguage);
  }

  /**
   * Get the selected language key of translations array
   * @returns
   */
  const getSelectedLanguageKey = () =>
    Object.keys(interfaceTranslations)[swiperRef.current?.realIndex ?? 0];

  /**
   * When the middle button is pressed, activate the language
   */
  const onMiddleButtonPressed = () => {
    // set the language in backend
    sendToServer('setLanguage', { language: getSelectedLanguageKey() });

    // set the language in the frontend
    changeTranslations(getSelectedLanguageKey());

    // navigate to count down
    navigate('/start-countdown');
  }

  /**
   * When the right button is pressed, we want to scroll to the next item
   */
  const onRightButtonPressed = () => {
    swiperRef.current?.slideNext();
    const selectedLanguageKey = getSelectedLanguageKey();
    setInstructions(interfaceTranslations[selectedLanguageKey as keyof typeof interfaceTranslations].pleaseSelectYourLanguage);
  }

  // Use the control hook
  useControl({ onLeftButtonPressed, onMiddleButtonPressed, onRightButtonPressed });

  return (
    <Page>
      <InformationBox text={instructions} />
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
          {Object.keys(interfaceTranslations).map((language) => (
            <SwiperSlideLanguage key={language}>
              <div>{interfaceTranslations[language as keyof typeof interfaceTranslations].language}</div>
            </SwiperSlideLanguage>
          ))}
        </Swiper>
      </div>
      <ControlBoxFixed />
    </Page>
  )
}