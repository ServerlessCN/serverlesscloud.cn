import * as React from 'react'
import styled from 'styled-components'
import { Flex, FlexProps } from './atoms'
import theme from '@src/constants/theme'

export interface Props extends React.Props<any>, FlexProps {}

const CardWrapper = styled(Flex)`
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03) translate3d(0, 0, 0) perspective(1px);
  }
  background: ${theme.colors.white};
`
export default function Card({ children, ref, ...rest }: Props) {
  return (
    <CardWrapper
      flexDirection={['column']}
      alignItems={['center']}
      width={[0.9, 0.9, 340, 360, 390]}
      height="416px"
      my={[32]}
      mx={[20]}
      style={{
        border: '1px solid #eaeaea',
        boxShadow: '2px 2px 8px 0 rgba(0, 0, 0, 0.08)',
      }}
      {...rest}
    >
      {children}
    </CardWrapper>
  )
}
