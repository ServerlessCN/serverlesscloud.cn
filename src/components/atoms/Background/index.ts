import styled from 'styled-components'
import {
  height,
  width,
  background,
  backgroundImage,
  backgroundRepeat,
  backgroundSize,
  backgroundPosition,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  space,
  HeightProps,
  WidthProps,
  BackgroundSizeProps,
  BackgroundColorProps,
  BackgroundImageProps,
  BackgroundPositionProps,
  BackgroundProps,
  BackgroundRepeatProps,
  MinHeightProps,
  MinWidthProps,
  MaxHeightProps,
  MaxWidthProps,
  SpaceProps,
} from 'styled-system'

export interface Props
  extends HeightProps,
    WidthProps,
    BackgroundSizeProps,
    BackgroundColorProps,
    BackgroundImageProps,
    BackgroundPositionProps,
    BackgroundProps,
    BackgroundRepeatProps,
    MinHeightProps,
    MinWidthProps,
    MaxHeightProps,
    SpaceProps,
    MaxWidthProps {}

export const Background = styled.div<Props>`
  ${height}
  ${width}
  ${background}
  ${backgroundImage}
  ${backgroundRepeat}
  ${backgroundSize}
  ${backgroundPosition}
  ${minHeight}
  ${minWidth}
  ${maxHeight}
  ${maxWidth}
  ${space}
`

Background.displayName = 'Background'
