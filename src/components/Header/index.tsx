import * as React from 'react'
import { Box, Position, Flex, Container } from '@src/components/atoms'
import styled from 'styled-components'
import { boxShadow, top, left, zIndex, BoxShadowProps } from 'styled-system'
import NavBar from './NavBar'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'
import Hemlet from 'react-helmet'
import CommunityEntrance from './CommunityEntrance'

import { withPrefix } from 'gatsby'

const WrapperWithBorderShadow = styled(Position)<BoxShadowProps>`
  ${boxShadow}
`

interface Props {}

const Header = (props: Props) => {
  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <CheckIfHeaderFixed.Consumer>
            {isHeaderFixed => {
              const navbarHeight = isDesktopView
                ? theme.navbarHeights.desktop
                : theme.navbarHeights.mobile
              const headerHeight = isDesktopView
                ? theme.headerHeights.desktop
                : theme.headerHeights.mobile

              return (
                <WrapperWithBorderShadow
                  position={isHeaderFixed ? 'fixed' : 'relative'}
                  top={0}
                  left={0}
                  height={headerHeight}
                  width={[1, 1, 1]}
                  bg={theme.colors.black}
                  zIndex={9999}
                  boxShadow={theme.shadows[0]}
                >
                  <Hemlet>
                    <script
                      type="text/javascript"
                      src={withPrefix('js/mta.js')}
                    ></script>
                  </Hemlet>

                 {/*<CommunityEntrance /> */} 

                  <NavBar height={navbarHeight} isDesktopView={isDesktopView} />
                </WrapperWithBorderShadow>
              )
            }}
          </CheckIfHeaderFixed.Consumer>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}

export default Header
