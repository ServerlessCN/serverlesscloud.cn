import styled from 'styled-components'

import Button from './../Button'
import { hexToRgbA } from '../utils'

const SecondaryButton = styled(Button)`
  background: ${({ background }) => background || 'transparent'};
  border-style: solid;
  border-width: ${({ borderWidth }) => borderWidth};
  border-color: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.primaryColor};
  &:hover {
    background: ${props =>
      props.disabled
        ? null
        : hexToRgbA(props.theme.colors.primaryColor, '0.1')};
  }
`

SecondaryButton.defaultProps = {
  borderWidth: '1px',
}

export default SecondaryButton
