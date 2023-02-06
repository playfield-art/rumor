import React from "react";
import styled from "styled-components";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export const SectionContainer = styled.div`
  background-color: var(--background-color-section);
  border-radius: 5px;
  padding: var(--default-padding);
  & > h2 {
    margin: 0 0 20px 0;
  }
`;

export const SectionContainerBody = styled.div`
  & > *:last-child {
    margin-bottom: 0;
  }
`;

export function Section({ title, children }: SectionProps) {
  return (
    <SectionContainer className="section-container">
      <h2>{title}</h2>
      <SectionContainerBody>{children}</SectionContainerBody>
    </SectionContainer>
  );
}
