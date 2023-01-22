import React from 'react'
import styled from 'styled-components';

export const AppContainer = styled.div`
  display: grid;
  gap: 0 20px;
  justify-content: center;
  padding: 20px;
  grid-template-columns: 1fr 300px;
`

export const AppVerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
