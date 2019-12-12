import * as React from 'react'
import styled from 'styled-components'
import { Flex, FlexProps } from './atoms'
import theme from '@src/constants/theme'
import { width, WidthProps, HeightProps } from 'styled-system'

export interface Props
  extends React.Props<any>,
    FlexProps,
    WidthProps,
    HeightProps {}

const CardWrapper = styled(Flex)`
  transition: transform 0.3s linear;
  border: 1px solid #eaeaea;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.08);
  &:hover {
    transform: translate3d(0, -5px, 0);
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.1);
  }
  background: ${theme.colors.white};
  ${width}
`
export default function Card({ children, ref, ...rest }: Props) {
  return (
    <CardWrapper
      flexDirection={['column']}
      alignItems={['center']}
      width={[0.9, 0.9, 340, 360, 390]}
      height="auto"
      min-height="416px"
      my={['15px', '15px', '15px', 32]}
      mx={['auto', 20]}
      {...rest}
    >
      {children}
    </CardWrapper>
  )
}
