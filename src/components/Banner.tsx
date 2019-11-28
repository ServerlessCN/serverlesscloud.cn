import * as React from 'react'
import logo from '@src/assets/images/chinese_community_bg.jpg'
import { Flex, Text, Background } from '@src/components/atoms'
import styled from 'styled-components'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'
import { width, WidthProps } from 'styled-system'

const MainTitle = styled(Text)`
  margin-bottom: 30px;
`

const CustomText = styled(Text)<WidthProps>`
  ${width}
`

interface Props {
  title?: string
  subTitle?: string
}

export default function({
  title = 'Serverless中文社区',
  subTitle = 'Serverless 中文技术网，专注 Serverless 架构最佳实践',
}: Props) {
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
                      {title}
                    </MainTitle>
                    <CustomText
                      fontSize={[
                        '0.8rem',
                        '0.8rem',
                        theme.fontSizes[0],
                        theme.fontSizes[0],
                        theme.fontSizes[0],
                      ]}
                      lineHeight={[
                        theme.lineHeights[2],
                        theme.lineHeights[2],
                        theme.lineHeights[3],
                        theme.lineHeights[3],
                        theme.lineHeights[3],
                      ]}
                      align="center"
                      color={theme.colors.white}
                      width={[0.9, 0.9, 0.9, 0.4]}
                    >
                      {subTitle}
                    </CustomText>
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
