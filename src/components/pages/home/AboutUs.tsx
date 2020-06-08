import * as React from 'react'
import { Container, Box } from '@src/components/atoms'
import './AboutUs.css'
import zhihu from '@src/assets/images/Zhihu_icon.png'
import segmentfault from '@src/assets/images/SegmentFault_icon.png'

const us: {
  icon: any
  title: string
  slogan: string
  link: string
}[] = [
  {
    icon: zhihu,
    title: '知乎',
    slogan: 'Serverless 精华讨论',
    link: 'https://zhuanlan.zhihu.com/ServerlessGo',
  },
  {
    icon: segmentfault,
    title: 'SegmentFault',
    slogan: 'Serverless 技术问答',
    link: 'https://segmentfault.com/t/serverless/questions',
  },
]
export default function() {
  return (
    <Box className="scf-home-about-us">
      <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
        <Box className="scf-box">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>中文社区</h3>
            </Box>
            <Box className="scf-box__header-more"></Box>
          </Box>

          <Box className="scf-box__body">
            <Box className="scf-about-us-box__body">
              <Box className="scf-box__body">
                <Box className="scf-grid">
                  {us.map(({ icon, title, slogan, link }) => (
                    <Box className="scf-grid__item-12">
                      <a href={link}>
                        <Box className="scf-grid__box">
                          <Box className="scf-home-about-us-item">
                            <Box className="scf-media">
                              <Box className="scf-media__media">
                                <img src={icon} alt={title} />
                              </Box>
                              <Box className="scf-media__content">
                                <Box className="scf-media__title">
                                  <h4>{title}</h4>
                                </Box>
                                <Box className="scf-media__info">
                                  <p>{slogan}</p>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </a>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
