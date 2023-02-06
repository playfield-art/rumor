import React from "react";
import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--background-color-popup);
  height: 100vh;
  width: 100vw;
`;

function Loader() {
  return <LoaderWrapper>Loader</LoaderWrapper>;
}

export default Loader;
