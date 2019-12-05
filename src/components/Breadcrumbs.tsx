import * as React from 'react'
// import _logo from '@src/assets/images/research_bg.jpg'
import _logo from '@src/assets/images/breadcrumbs_bg.jpg'

import {
  Background,
  Flex,
  Text,
  Container,
  Heading1,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'

export default function({
  children,
  logo,
}: React.Props<any> & {
  logo?: any
}) {
  const boxHeight = 120

  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <CheckIfHeaderFixed.Consumer>
            {isHeaderFixed => {
              return (
                <Background
                  width={1}
                  height={boxHeight}
                  backgroundSize="100% 100%"
                  backgroundRepeat="no-repeat"
                  backgroundImage={`url(${logo || _logo})`}
                  pt={
                    isHeaderFixed
                      ? isDesktopView
                        ? theme.headerHeights.desktop
                        : theme.headerHeights.mobile
                      : 0
                  }
                >
                  <Container
                    width={[0.95, 0.95, 0.95, 0.95, 1216]}
                    maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent={[
                        'center',
                        'center',
                        'center',
                        'flex-start',
                      ]}
                      height={boxHeight}
                    >
                      <Heading1
                        my="20px"
                        align={['center', 'center', 'center', 'left']}
                        fontSize={[
                          theme.fontSizes[0],
                          theme.fontSizes[0],
                          theme.fontSizes[1],
                          theme.fontSizes[2],
                          theme.fontSizes[3],
                        ]}
                        fontWeight="bold"
                        color={theme.colors.black}
                      >
                        {children}
                      </Heading1>
                    </Flex>
                  </Container>
                </Background>
              )
            }}
          </CheckIfHeaderFixed.Consumer>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}
