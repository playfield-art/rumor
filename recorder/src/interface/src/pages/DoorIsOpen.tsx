import React from 'react'
import { Page } from './Layouts/Page';
import { useTranslationsStore } from '../hooks/useTranslationsStore';

export const DoorIsOpen = () => {
  const translations = useTranslationsStore((state) => state.translations)
  return (
    <Page>
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px",
        boxSizing: "border-box"
      }}>
        <h1>
          <p>{translations.doorIsOpen}</p>
        </h1>
      </div>
    </Page>
  )
}