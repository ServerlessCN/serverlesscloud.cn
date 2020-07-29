// const breakpoints = [ '1600px']
const breakpoints = ['320px', '768px', '993px', '1200px', '1600px']

const navbarHeights = {
  mobile: '47px',
  desktop: '64px',
}

const headerHeights = {
  mobile: '48px',
  desktop: '60px',
}

const maxWidths = ['100%', '1260px']

const colors = {
  text: '#024',
  gray_text: 'rgba(255, 255, 255, 0.5)',
  white: '#fff',
  black: '#000',
  theme: '#F7F7F7',
  serverlessRed: '#0052D9',
  tencentTheme: '#0052D9',
  darkServerlessRed: '#b73833',
  // nested objects work as well
  dark: {
    blue: '#058',
  },
  // arrays can be used for scales of colors
  gray: ['#f7f7f7', '#eaeaea', '#8c8c8c', '#5b5b5b'],
  gradient: {
    black1: '#222222',
  },
  primaryColor: '',
  secondaryColor: '',
}
colors.primaryColor = colors.serverlessRed
colors.secondaryColor = colors.darkServerlessRed

// space is used for margin and padding scales
// it's recommended to use powers of two to ensure alignment
// when used in nested elements
// numbers are converted to px
const space = [0, 10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240]
// typographic scale
const fontSizes = ['1.2rem', '1.4rem', '1.6rem', '1.8rem', '2.4rem', '3.2rem', '4rem', '4.8rem', '9rem']

// for any scale, either array or objects will work
const lineHeights = [1, 1.125, 1.25, 1.33, 1.5, 2, 3, 7]

const heights = {
  fullHeight: '100%',
}

const fontWeights = {
  normal: 400,
  bold: 700,
}

const letterSpacings = {
  normal: 'normal',
  caps: '0.25em',
  smallNegative: '-0.03px',
  primaryBtn: '0.05em',
  textField: '0.5px',
  text: '0.6px',
  h1: 'normal',
  h2: '0.5px',
  h3: 'normal',
  h4: '-0.5px',
  h5: '-0.4px',
  h6: '-0.3px',
}

// border-radius
const radii = [0, 2, 4, 8]

const borders = [0, '1px solid', '2px solid', '3px solid']

const shadows = [`rgba(0, 0, 0, 0.08) 2px 2px 8px 0px`]

const theme = {
  maxContainerWidth: '1260px',
  heights,
  breakpoints,
  navbarHeights,
  maxWidths,
  colors,
  space,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacings,
  radii,
  borders,
  shadows,
  headerHeights,
}

export default theme
