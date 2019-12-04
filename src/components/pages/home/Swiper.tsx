import * as React from 'react'
import logo from '@src/assets/images/chinese_community_bg.jpg'
import { Flex, Text, Background, Box } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext, CheckIfHeaderFixed } from '@src/contexts'
import Swiper from '@src/components/Swiper'

export default function() {
  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <CheckIfHeaderFixed.Consumer>
            {isHeaderFixed => {
              return (
                <Box
                  pt={
                    isDesktopView
                      ? theme.headerHeights.desktop
                      : theme.headerHeights.mobile
                  }
                >
                  <Swiper>
                    <Background
                      className="swiper-slide"
                      width={1}
                      height={['200px', '200px', '200px', '300px']}
                      backgroundSize="100% 100%"
                      backgroundRepeat="no-repeat"
                      backgroundImage={`url(${logo})`}
                    />
                    <Background
                      className="swiper-slide"
                      width={1}
                      height={['200px', '200px', '200px', '300px']}
                      backgroundSize="100% 100%"
                      backgroundRepeat="no-repeat"
                      backgroundImage={`url(${logo})`}
                    />
                    <Background
                      className="swiper-slide"
                      width={1}
                      height={['200px', '200px', '200px', '300px']}
                      backgroundSize="100% 100%"
                      backgroundRepeat="no-repeat"
                      backgroundImage={`url(${logo})`}
                    />
                  </Swiper>
                </Box>
              )
            }}
          </CheckIfHeaderFixed.Consumer>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}
