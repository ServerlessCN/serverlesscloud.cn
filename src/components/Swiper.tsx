import * as React from 'react'
import Swiper, { SwiperOptions } from 'swiper'
import styled from 'styled-components'
import { Box } from '@src/components/atoms'
import 'swiper/css/swiper.min.css'
import theme from '@src/constants/theme'
import { HeightProps } from 'styled-system'

const Wrapper = styled(Box)`
.swiper-container{
  position: relative;
}

.swiper-pagination{
  width:100%;
  bottom: 0px !important;
  left: 0px !important;
  position: absolute;
  background-color: #fff !important;
}
.swiper-wrapper {
  height: 316px !important;
}

.swiper-pagination .swiper-pagination-bullet {
  float:left;
  width: 30px;
  height: 5px;
  margin: 0px !important;
  margin-right: 8px !important;;
  border-radius:0;
}
.swiper-pagination .swiper-pagination-bullet-active {
    background-color: ${theme.colors.serverlessRed};
  }
`

export interface Props extends React.Props<any>, HeightProps {
  swiperProps?: SwiperOptions
}

export default function(props: Props) {
  const { swiperProps, children, height } = props

  React.useEffect(() => {
    const _swiperProps = Object.assign(
      {
        loop: true,
        speed: 500,
        effect: 'fade',
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      } as SwiperOptions,
      swiperProps || {}
    )
    ;(_swiperProps.pagination as any).el = '.swiper-pagination'
    new Swiper('.swiper-container', _swiperProps)
  }, [swiperProps])

  return (
    <Wrapper width={1} height={height} className="swiper-container">
      <div className="swiper-wrapper">{children}</div>
      <div className="swiper-pagination"></div>
    </Wrapper>
  )
}
