import React from 'react'
import { styled } from 'styled-components'
import {
  AiOutlineRollback,
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
  AiFillCheckCircle
} from 'react-icons/ai';

type ControlBoxProps = {
  enableLeft?: boolean,
  enableRight?: boolean,
  enableMiddle?: boolean,
  height?: number,
  middleButtonType?: 'check' | 'back'
}

const ControlBoxWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;
  width: 100%;
  position: fixed;
  bottom: 0;
`

const ControlBoxCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 3rem;
`

export const ControlBoxFixed = ({
    enableLeft = true,
    enableMiddle = true,
    enableRight = true,
    height = 100,
    middleButtonType = 'check'
  }: ControlBoxProps) => {
  return (
    <ControlBoxWrapper style={{ height }}>
      <ControlBoxCell>
        {enableLeft && <AiOutlineLeftCircle />}
      </ControlBoxCell>
      <ControlBoxCell>
        {middleButtonType === 'check' && enableMiddle && <AiFillCheckCircle />}
        {middleButtonType === 'back' && enableMiddle && <AiOutlineRollback />}
      </ControlBoxCell>
      <ControlBoxCell>
        {enableRight && <AiOutlineRightCircle />}
      </ControlBoxCell>
    </ControlBoxWrapper>
  )
}