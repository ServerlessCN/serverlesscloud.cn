import * as React from 'react'
import Footer from '@src/components/Footer'
import Header from '@src/components/Header'
import { Column } from '@src/components/atoms'
import styled, { ThemeProvider } from 'styled-components'
import theme from '@src/constants/theme'
import { width } from 'styled-system'
import { CheckIfDesktopContext } from '@src/contexts'
import { debounce } from '@src/utils'

const FlexWithBox = styled(Column)`
  ${width}
  min-height: 100vh;
`

const Layout = ({ children }: React.Props<any>) => {
  const [isDesktopView, setIsDesktopView] = React.useState(true)

  React.useEffect(() => {
    const onResize = debounce(() => {
      setIsDesktopView(!!(window.innerWidth > 992))
    }, 50)

    window.addEventListener('resize', onResize)
    setIsDesktopView(!!(window.innerWidth > 992))

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <CheckIfDesktopContext.Provider value={isDesktopView}>
        <FlexWithBox width={1}>
          <Header />
          {children}
          <Footer />
        </FlexWithBox>
      </CheckIfDesktopContext.Provider>
    </ThemeProvider>
  )
}

export default Layout
