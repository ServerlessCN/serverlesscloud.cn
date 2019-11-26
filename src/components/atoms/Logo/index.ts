import styled from 'styled-components'
import { height, width, HeightProps, WidthProps } from 'styled-system'

interface Props extends HeightProps, WidthProps {}

export const Logo = styled.img<Props>`
  cursor: pointer;
  ${height}
  ${width}
`

Logo.displayName = 'Logo'
