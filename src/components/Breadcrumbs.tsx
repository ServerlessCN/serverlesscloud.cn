import * as React from 'react'
import _logo from '@src/assets/images/research_bg.jpg'
import { Background, Flex, Text, Container } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { MainTitle } from './Title'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'

export default function({
  children,
  logo,
}: React.Props<any> & {
  logo?: any
}) {
  const boxHeight = 200

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
                  <Container>
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
                      <MainTitle
                        px={[0, 0, 0, '10px', 0, 0]}
                        color={theme.colors.white}
                      >
                        {children}
                      </MainTitle>
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
