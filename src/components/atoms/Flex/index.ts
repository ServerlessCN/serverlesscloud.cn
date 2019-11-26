import styled, { StyledComponent } from 'styled-components'
import { Box } from '../Box'
import {
  alignItems,
  flexDirection,
  flexWrap,
  justifyContent,
  order,
  AlignItemsProps,
  FlexDirectionProps,
  JustifyContentProps,
  OrderProps,
  FlexWrapProps,
} from 'styled-system'

export const Flex = styled(Box)<FlexProps>`
  display: flex;

  ${alignItems}
  ${flexDirection}
  ${flexWrap}
  ${justifyContent}
  ${order}
`

export interface FlexProps
  extends AlignItemsProps,
    FlexDirectionProps,
    JustifyContentProps,
    OrderProps,
    FlexWrapProps {}

export const FlexCenter = styled(Flex)`
  justify-content: center;
  align-items: center;
`

export type FlexCenterProps = Omit<FlexProps, 'justifyContent' | 'alignItems'>

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`

export type FlexColumnProps = Omit<FlexProps, 'flexDirection'>

export const FlexRow = styled(Flex)`
  flex-direction: row;
`

export type FlexRowProps = Omit<FlexProps, 'flexDirection'>

export const FlexInline = styled(Flex)`
  display: inline-flex;
`

export type FlexInlineProps = Omit<FlexProps, 'display'>
