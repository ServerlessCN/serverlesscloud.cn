import * as React from 'react'
import Swiper, { SwiperOptions } from 'swiper'
import styled from 'styled-components'
import { Box } from '@src/components/atoms'
import 'swiper/css/swiper.min.css'
import theme from '@src/constants/theme'

const Wrapper = styled(Box)`
  .swiper-pagination .swiper-pagination-bullet-active {
    background-color: ${theme.colors.serverlessRed};
  }
`

export interface Props extends React.Props<any> {
  swiperProps?: SwiperOptions
}

export default function(props: Props) {
  const { swiperProps, children } = props

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
      },
      swiperProps || {}
    ) as SwiperOptions
    ;(_swiperProps.pagination as any).el = '.swiper-pagination'
    new Swiper('.swiper-container', _swiperProps)
  }, [swiperProps])

  return (
    <Wrapper
      width={1}
      height={['200px', '200px', '200px', '300px']}
      className="swiper-container"
    >
      <div className="swiper-wrapper">{children}</div>
      <div className="swiper-pagination"></div>
    </Wrapper>
  )
}
