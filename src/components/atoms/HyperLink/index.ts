import styled from 'styled-components'
import {
  color,
  borderBottom,
  borderColor,
  ColorProps,
  BorderColorProps,
  BorderBottomProps,
} from 'styled-system'
import {
  textDecoration,
  TextDecorationProps,
} from '@src/components/atoms/customStyleSystem'
import * as CSS from 'csstype'
import theme from '@src/constants/theme'
import { Link } from 'gatsby'

interface Props
  extends ColorProps,
    BorderColorProps,
    BorderBottomProps,
    TextDecorationProps {
  hoverColor: CSS.ColorProperty
  activeColor: CSS.ColorProperty
}

const HyperLink = styled.a<Props>`
  ${textDecoration}
  ${borderBottom}
  ${borderColor}
  ${color}

  transition: all 0.3s ease;

  &:hover {
    ${({ hoverColor }) => ({ color: hoverColor })}
  }

  &:active {
    ${({ activeColor }) => ({ color: activeColor })}
  }
`

const HyperGatsbyLink = HyperLink.withComponent(Link)

HyperLink.defaultProps = {
  color: theme.colors.serverlessRed,
}

HyperGatsbyLink.defaultProps = {
  color: theme.colors.serverlessRed,
}

export { HyperLink, HyperGatsbyLink, Props }
