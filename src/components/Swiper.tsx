import * as React from 'react'
import Swiper, { SwiperOptions } from 'swiper'
import styled from 'styled-components'
import { Box } from '@src/components/atoms'
import 'swiper/css/swiper.min.css'
import theme from '@src/constants/theme'
import { HeightProps } from 'styled-system'

const Wrapper = styled(Box)`
  .swiper-container {
    position: relative;

    height: 100% !important;
    overflow: visible !important;
  }

  @media screen and (min-width: 992px) {
    .swiper-container {
      width: 100% !important;
    }
  }

  .swiper-pagination {
    font-size: 0;
    position: absolute;
    left: 0;
    width: auto !important;
    bottom: -25px !important;
  }
  .swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .swiper-pagination .swiper-pagination-bullet {
    display: inline-block !important;
    width: 30px;
    height: 24px;
    margin: 0px !important;
    margin-right: 10px !important;
    background-color: hsla(0, 0%, 50.2%, 0.5);
    border: 10px solid #fff;
    border-width: 10px 0;
    cursor: pointer;
    border-radius: 0;
    outline: none;
    box-sizing: border-box !important;
  }
  .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 !important;
  }
  .swiper-pagination .swiper-pagination-bullet-active {
    background-color: ${theme.colors.tencentTheme};
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
