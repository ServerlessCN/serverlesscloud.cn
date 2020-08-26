import * as React from 'react'
import { Container, Box } from '@src/components/atoms'
import { Link } from 'gatsby'
import video1 from '@src/assets/images/video1.png'
import video2 from '@src/assets/images/video2.png'
import video3 from '@src/assets/images/video3.png'
import video4 from '@src/assets/images/video4.png'
import video5 from '@src/assets/images/video5.png'

import './Videos.css'

interface Video {
  img: any
  title: any
  link: string
}

const VideoList: Video[] = [
  {
    img: video1,
    title: 'Tencent Serverless Hours 在线分享',
    link: 'https://cloud.tencent.com/edu/act/customTopics/scf',
  },
  {
    img: video2,
    title: 'Serverless 学习路径课',
    link: 'https://cloud.tencent.com/edu/paths/series/Serverless',
  },
  {
    img: video3,
    title: 'Serverless 开发实战之 Nodejs',
    link: 'https://cloud.tencent.com/edu/learning/live-1888',
  },
  {
    img: video4,
    title: 'Serverless Python 开发实战之极速制作情人节表白页',
    link: 'https://cloud.tencent.com/edu/learning/live-1910',
  },
  {
    img: video5,
    title: 'Serverless 架构揭秘与静态网站部署实战',
    link: 'https://cloud.tencent.com/edu/learning/live-1879',
  },
]

export default function() {
  return (
    <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
      <Box className="scf-home-video">
        <Box className="scf-box__header">
          <Box className="scf-box__header-title  size-s">
            <h3>视频</h3>
          </Box>
          <Box className="scf-box__header-more">
            <Link to="/resource">更多视频 &gt;</Link>
          </Box>
        </Box>
        <Box className="scf-box__body">
          <Box className="scf-grid">
            <Box className="scf-grid__item-12">
              <Box className="scf-grid__box">
                <Box className="scf-video-item scf-video-item--block">
                  <a href={VideoList[0].link}>
                    <img src={VideoList[0].img} alt={VideoList[0].title} />
                    <Box className="scf-video-item__info">
                      <a href={VideoList[0].link}>
                        <i className="scf-icon scf-icon-video"></i>
                      </a>
                      <span className="scf-video-item__title">{VideoList[0].title}</span>
                    </Box>
                  </a>
                </Box>
              </Box>
            </Box>
            <Box className="scf-grid__item-12">
              <Box className="scf-grid__box">
                <Box className="scf-grid">
                  <Box className="scf-grid__item-12">
                    <Box className="scf-grid__box">
                      <Box className="scf-video-item scf-video-item--block">
                        <a href={VideoList[1].link}>
                          <img src={VideoList[1].img} alt={VideoList[1].title} />
                          <Box className="scf-video-item__info">
                            <a href={VideoList[1].link}>
                              <i className="scf-icon scf-icon-video"></i>
                            </a>
                            <span className="scf-video-item__title">{VideoList[1].title}</span>
                          </Box>
                        </a>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="scf-grid__item-12">
                    <Box className="scf-grid__box">
                      <Box className="scf-video-item scf-video-item--block">
                        <a href={VideoList[2].link}>
                          <img src={VideoList[2].img} alt={VideoList[2].title} />
                          <Box className="scf-video-item__info">
                            <a href={VideoList[2].link}>
                              <i className="scf-icon scf-icon-video"></i>
                            </a>
                            <span className="scf-video-item__title">{VideoList[2].title}</span>
                          </Box>
                        </a>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="scf-grid">
                  <Box className="scf-grid__item-12">
                    <Box className="scf-grid__box">
                      <Box className="scf-video-item scf-video-item--block">
                        <a href={VideoList[3].link}>
                          <img src={VideoList[3].img} alt={VideoList[3].title} />
                          <Box className="scf-video-item__info">
                            <a href={VideoList[3].link}>
                              <i className="scf-icon scf-icon-video"></i>
                            </a>
                            <span className="scf-video-item__title">{VideoList[3].title}</span>
                          </Box>
                        </a>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="scf-grid__item-12">
                    <Box className="scf-grid__box">
                      <Box className="scf-video-item scf-video-item--block">
                        <a href={VideoList[4].link}>
                          <img src={VideoList[4].img} alt={VideoList[4].title} />
                          <Box className="scf-video-item__info">
                            <a href={VideoList[4].link}>
                              <i className="scf-icon scf-icon-video"></i>
                            </a>
                            <span className="scf-video-item__title">{VideoList[4].title}</span>
                          </Box>
                        </a>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
