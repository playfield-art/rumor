import React from 'react'
import styled from 'styled-components'

type PageProps = {
  children: React.ReactNode
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Page = ({
    children
  }: PageProps) => {
  return (
    <PageWrapper>
      {children}
    </PageWrapper>
  )
}