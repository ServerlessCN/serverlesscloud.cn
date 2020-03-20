import * as React from 'react'
import logo from '@src/assets/images/research_bg.jpg'
import { Background, Flex, TertiaryButton } from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import { MainTitle } from '@src/components/pages/home/Title'

const Button = styled.button`
  color: ${theme.colors.serverlessRed};
  background-color: ${theme.colors.white};
  font-size: 18px;
  width: 160px;
  margin: 20px 0 0 0;
  padding: 0.4rem;

  &:disabled {
    opacity: 0.2;
  }

  &:hover {
    border: 1px solid ${theme.colors.serverlessRed};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`

export default function() {
  const boxHeight = 200

  return (
    <Background
      width={1}
      height={boxHeight}
      backgroundSize="100% 100%"
      backgroundRepeat="no-repeat"
      backgroundImage={`url(${logo})`}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height={boxHeight}
      >
        <MainTitle color={theme.colors.white}>
          Serverless Framework 用户使用情况调查
        </MainTitle>

        <TertiaryButton>立即参与</TertiaryButton>
      </Flex>
    </Background>
  )
}
