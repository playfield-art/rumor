import React, { useRef } from 'react'
import { SwiperClass, SwiperSlide, Swiper } from 'swiper/react'
import 'swiper/css';

type LanguageSwiperProps = {
  languages: { label: string, value: string }[]
}

export const LanguageSwiper = ({ languages }: LanguageSwiperProps) => {
  const swiperRef = useRef<SwiperClass>();
  return (
    <Swiper
      slidesPerView={1}
      loop
      onSwiper={(swiper) => swiperRef.current = swiper}
    >
      {languages.map((language) => (
        <SwiperSlide style={{ backgroundColor: "red"}} key={language.value}>{language.label}</SwiperSlide>
      ))}
    </Swiper>
  )
}