import React from 'react'

type InformationBoxProps = {
  text: string;
}

export const InformationBox = ({ text }: InformationBoxProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '40px',
      boxSizing: 'border-box',
      display: "flex",
      justifyContent: "center",
      alignItems: "center" }}
    >
      <h1>{text}</h1>
    </div>
  )
}