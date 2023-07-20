import React from "react";
import styled from "styled-components";
import { useAppStore } from "@hooks/useAppStore";

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
  font-size: 1.5rem;
`;

function Loader() {
  const procesStatus = useAppStore((state) => state.procesStatus);
  return <LoaderWrapper>{procesStatus.message}</LoaderWrapper>;
}

export default Loader;
