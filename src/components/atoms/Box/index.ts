import styled from 'styled-components'
import {
  color,
  display,
  space,
  height,
  maxHeight,
  minHeight,
  width,
  maxWidth,
  minWidth,
  ColorProps,
  DisplayProps,
  SpaceProps,
  HeightProps,
  MaxHeightProps,
  MinHeightProps,
  WidthProps,
  MaxWidthProps,
  MinWidthProps,
} from 'styled-system'

import {
  boxSizing,
  BoxSizingProps,
} from '@src/components/atoms/customStyleSystem'

export interface Props
  extends HeightProps,
    WidthProps,
    ColorProps,
    DisplayProps,
    SpaceProps,
    MinHeightProps,
    MinWidthProps,
    MaxHeightProps,
    BoxSizingProps,
    MaxWidthProps {}

export const Box = styled.div<Props>`
  ${color}
  ${display}
  ${height}
  ${maxHeight}
  ${maxWidth}
  ${minHeight}
  ${minWidth}
  ${space}
  ${width}
  ${boxSizing}
`

Box.defaultProps = {
  boxSizing: 'border-box',
}

Box.displayName = 'Box'
