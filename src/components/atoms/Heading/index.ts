import { Text } from '../Text'
import theme from '@src/constants/theme'

export const Heading = Text.withComponent('h3')
Heading.defaultProps = {
  fontFamily: theme.font.header,
}

Heading.displayName = 'Heading'

export const Heading1 = Heading.withComponent('h1')
Heading1.defaultProps = {
  fontSize: 7,
  lineHeight: 3,
  letterSpacing: theme.letterSpacings.h1,
  fontWeight: theme.fontWeights.normal,
  mb: '20px',
}

export const Heading2 = Heading.withComponent('h2')
Heading2.defaultProps = {
  fontSize: 6,
  lineHeight: 0,
  letterSpacing: theme.letterSpacings.h2,
  fontWeight: theme.fontWeights.normal,
  mb: '20px',
}

export const Heading3 = Heading.withComponent('h3')
Heading3.defaultProps = {
  fontSize: 5,
  lineHeight: 1,
  letterSpacing: theme.letterSpacings.h3,
  fontWeight: theme.fontWeights.normal,
  mb: '16px',
}

export const Heading4 = Heading.withComponent('h4')
Heading4.defaultProps = {
  fontSize: 4,
  lineHeight: 0,
  letterSpacing: theme.letterSpacings.h4,
  fontWeight: theme.fontWeights.normal,
  mb: '12px',
}

export const Heading5 = Heading.withComponent('h5')
Heading5.defaultProps = {
  fontSize: 3,
  lineHeight: 3,
  letterSpacing: theme.letterSpacings.h5,
  fontWeight: theme.fontWeights.normal,
  mb: '8px',
}

export const Heading6 = Heading.withComponent('h6')
Heading6.defaultProps = {
  fontSize: 2,
  lineHeight: 3,
  letterSpacing: theme.letterSpacings.h6,
  fontWeight: theme.fontWeights.normal,
  mb: '4px',
}
