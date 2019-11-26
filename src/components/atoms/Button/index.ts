import styled, { withTheme } from 'styled-components'
import {
  border,
  borderWidth,
  borderStyle,
  borderColor,
  color,
  fontFamily,
  fontSize,
  letterSpacing,
  space,
  width,
  height,
  minWidth,
  background,
  borderRadius,
  BorderRadiusProps,
  BorderProps,
  BorderWidthProps,
  BorderColorProps,
  BorderStyleProps,
  FontFamilyProps,
  FontSizeProps,
  LetterSpacingProps,
  SpaceProps,
  WidthProps,
  HeightProps,
  MinWidthProps,
  ColorProps,
  BackgroundProps,
} from 'styled-system'
import { hexToRgbA } from '../utils'
import { boxSizing, BoxSizingProps } from '../customStyleSystem'

export interface Props
  extends BorderProps,
    BorderWidthProps,
    BorderColorProps,
    BorderStyleProps,
    FontFamilyProps,
    FontSizeProps,
    LetterSpacingProps,
    SpaceProps,
    WidthProps,
    HeightProps,
    ColorProps,
    MinWidthProps,
    BorderRadiusProps,
    BackgroundProps,
    BoxSizingProps {}

const _Button = styled.button<Props>`
  padding: 0.4rem;

  ${color}
  ${border}
  ${borderWidth}
  ${borderStyle}
  ${borderColor}
  ${fontFamily}
  ${fontSize}
  ${space}
  ${letterSpacing}
  ${width}
  ${height}
  ${minWidth}
  ${borderRadius}
  ${background}
  ${boxSizing}

  &:disabled {
    opacity: 0.2;
  }

  &:hover {
    background-color: ${props =>
      props.disabled ? null : props.theme.colors.secondaryColor};
    border-color: ${props =>
      props.disabled ? null : props.theme.colors.secondaryColor}
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`

_Button.defaultProps = {
  width: '160px',
  height: '40px',
  color: 'white',
  bg: 'primaryColor',
  border: 'none',
  borderColor: 'primaryColor',
  fontSize: '18px',
  letterSpacing: 'primaryBtn',
  borderRadius: '5px',
  boxSizing: 'border-box',
}

_Button.displayName = 'Button'
export const Button = withTheme(_Button)

export const TertiaryButton = styled(Button)`
  background: ${({ background }) => background || 'white'};
  color: ${({ theme }) => theme.colors.primaryColor};
  transition: background 0.5s ease;
  &:hover {
    background: ${props =>
      props.disabled ? null : hexToRgbA(props.theme.colors.white, 0.7)};
  }
`
