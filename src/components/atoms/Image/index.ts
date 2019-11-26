import styled from 'styled-components'
import {
  width,
  height,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  HeightProps,
  MaxHeightProps,
  MinHeightProps,
  WidthProps,
  MaxWidthProps,
  MinWidthProps,
  space,
  SpaceProps,
} from 'styled-system'

export interface Props
  extends HeightProps,
    WidthProps,
    MinHeightProps,
    MinWidthProps,
    MaxHeightProps,
    MaxWidthProps,
    SpaceProps {}

export const Image = styled.img<Props>`
  ${width}
  ${height}
  ${maxHeight}
  ${maxWidth}
  ${minHeight}
  ${minWidth}
  ${space}
`
