import styled from "styled-components";

export const AppVerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & > .section-container:not(:last-child) {
    margin-bottom: var(--default-margin);
  }
`;
