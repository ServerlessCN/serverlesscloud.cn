import styled from 'styled-components'

import theme from '@src/constants/theme'
import { Box } from '../Box'

export const Container = styled(Box)`
  margin-left: auto;
  margin-right: auto;
`

Container.defaultProps = {
  maxWidth: theme.maxContainerWidth,
}

Container.displayName = 'Container'
