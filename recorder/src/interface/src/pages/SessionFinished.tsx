import React, { useEffect } from 'react'
import { Page } from './Layouts/Page';
import { useTranslationsStore } from '../hooks/useTranslationsStore';
import { useScreen } from '../hooks/useScreen';
import qr from '../../public/qr.svg'
import { useNavigate } from 'react-router-dom';
import { useControl } from '../hooks/useControl';

export const SessionFinished = () => {
  useScreen(true);
  const navigate = useNavigate();
  const sessionFinishedSeconds = 60;

  useEffect(() => {
    const removeTimeout = setTimeout(() => {
      navigate("/set-language")
    }, sessionFinishedSeconds * 1000);
    return () => {
      clearTimeout(removeTimeout);
    }
  }, []);

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
        boxSizing: "border-box",
        color: "var(--color-text)",
      }}>
          <img style={{
            minWidth: "256px",
            maxWidth: "256px",
            minHeight: "256px",
            maxHeight: "256px"
          }} src={qr} />
      </div>
    </Page>
  )
}