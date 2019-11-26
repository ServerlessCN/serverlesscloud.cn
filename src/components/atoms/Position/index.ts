import styled from 'styled-components'
import {
  top,
  left,
  right,
  bottom,
  zIndex,
  position,
  ZIndexProps,
  BottomProps,
  LeftProps,
  RightProps,
  TopProps,
  PositionProps,
} from 'styled-system'

import { Box } from '../Box'

export interface Props
  extends ZIndexProps,
    BottomProps,
    LeftProps,
    RightProps,
    TopProps,
    PositionProps {}

export const Position = styled(Box)<Props>`
  ${position}
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${zIndex}
`

export const Absolute = styled(Box)<Props>`
  position: absolute;

  ${position}
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${zIndex}
`

export const Relative = styled(Box)<Props>`
  position: relative;

  ${top}
  ${left}
  ${right}
  ${bottom}
  ${zIndex}
`

export const Fixed = styled(Box)<Props>`
  position: fixed;

  ${top}
  ${left}
  ${right}
  ${bottom}
  ${zIndex}
`
