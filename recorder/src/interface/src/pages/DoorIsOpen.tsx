import React from 'react'
import { Page } from './Layouts/Page';
import { useTranslationsStore } from '../hooks/useTranslationsStore';
import { useScreen } from '../hooks/useScreen';
import { useControl } from '../hooks/useControl';

export const DoorIsOpen = () => {
  const translations = useTranslationsStore((state) => state.translations)
  useScreen(true);

  /**
   * We don't want to do anything when the buttons are pressed
   */
  useControl({
    onLeftButtonPressed: () => {},
    onMiddleButtonPressed: () => {},
    onRightButtonPressed: () => {}
  });

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