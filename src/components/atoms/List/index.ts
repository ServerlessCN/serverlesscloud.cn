import styled, { StyledProps } from 'styled-components'
import { space, display, SpaceProps, DisplayProps } from 'styled-system'

import {
  styleType,
  ListStyleTypeProps,
} from '@src/components/atoms/customStyleSystem'

const List = styled.ul<ListProps>`
  ${space}
`

interface ListProps extends SpaceProps {}

const ListItem = styled.li<ListItemProps>`
  ${space}
  ${display}
  ${styleType}
`

interface ListItemProps extends SpaceProps, DisplayProps, ListStyleTypeProps {}

const ListItemWithNoStyleType = styled(ListItem)<ListStyleTypeProps>`
  list-style-type: none;
`

export { List, ListItem, ListItemProps, ListProps, ListItemWithNoStyleType }
