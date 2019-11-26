import styled from 'styled-components'
import {
  color,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  space,
  opacity,
  ColorProps,
  FontWeightProps,
  FontSizeProps,
  LetterSpacingProps,
  LineHeightProps,
  SpaceProps,
  OpacityProps,
  FontFamilyProps,
} from 'styled-system'
import { align, TextAlignProps } from '@src/components/atoms/customStyleSystem'

export interface Props
  extends ColorProps,
    FontWeightProps,
    FontSizeProps,
    LetterSpacingProps,
    LineHeightProps,
    SpaceProps,
    TextAlignProps,
    FontFamilyProps,
    OpacityProps {}

export const Text = styled.div<Props>`
  ${color}
  ${fontFamily}
  ${fontSize}
  ${fontWeight}
  ${letterSpacing}
  ${lineHeight}
  ${space}
  ${align}
  ${opacity}
`

Text.displayName = 'Text'

export const TextSpan = Text.withComponent('span')
export const TextP = Text.withComponent('p')
