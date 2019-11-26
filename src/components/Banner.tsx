import * as React from 'react'
import logo from '@src/assets/images/chinese_community_bg.jpg'
import { Flex, Text, Background } from '@src/components/atoms'
import styled from 'styled-components'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'

const MainTitle = styled(Text)`
  margin-bottom: 30px;
`

export default function() {
  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <CheckIfHeaderFixed.Consumer>
            {isHeaderFixed => {
              return (
                <Background
                  width={1}
                  height={['200px', '200px', '200px', '300px']}
                  backgroundSize="100% 100%"
                  backgroundRepeat="no-repeat"
                  backgroundImage={`url(${logo})`}
                  pt={
                    isDesktopView
                      ? theme.headerHeights.desktop
                      : theme.headerHeights.mobile
                  }
                >
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height={['200px', '200px', '200px', '300px']}
                  >
                    <MainTitle
                      fontSize={[
                        theme.fontSizes[0],
                        theme.fontSizes[0],
                        theme.fontSizes[1],
                        theme.fontSizes[4],
                        theme.fontSizes[5],
                      ]}
                      color={theme.colors.white}
                    >
                      Serverless中文社区
                    </MainTitle>
                    <Text
                      fontSize={[
                        '0.8rem',
                        '0.8rem',
                        theme.fontSizes[0],
                        theme.fontSizes[0],
                        theme.fontSizes[0],
                      ]}
                      color={theme.colors.white}
                    >
                      Serverless 中文技术网，专注 Serverless 架构最佳实践
                    </Text>
                  </Flex>
                </Background>
              )
            }}
          </CheckIfHeaderFixed.Consumer>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}
