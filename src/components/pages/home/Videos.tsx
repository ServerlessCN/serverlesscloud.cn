import * as React from 'react'
import {Background, Center, Row} from '@src/components/atoms'
import theme from '@src/constants/theme'
import {Link} from 'gatsby'
import video1 from '@src/assets/images/video1.png'
import video2 from '@src/assets/images/video2.png'
import video3 from '@src/assets/images/video3.png'
import video4 from '@src/assets/images/video4.png'
import video5 from '@src/assets/images/video5.png'

import './Videos.css'

interface Video {
  img : any
  title : any
  link : string
}

const VideoList : Video[] = [
  {
    img: video1,
    title: "Serverless 工程化实战：基于 Python + JS 的动态博客开发",
    link: "https://cloud.tencent.com/edu/learning/live-1926"
  }, {
    img: video2,
    title: "Serverless 开发实战之 Nodejs",
    link: "https://cloud.tencent.com/edu/learning/live-1888"
  }, {
    img: video3,
    title: "Serverless Python 开发实战之极速制作情人节表白页",
    link: "https://cloud.tencent.com/edu/learning/live-1910"
  }, {
    img: video4,
    title: "Serverless Python 开发实战之极速制作情人节表白页",
    link: "https://cloud.tencent.com/edu/learning/live-1879"
  }, {
    img: video5,
    title: "Serverless 从入门到精通：架构介绍及场景分析",
    link: "https://cloud.tencent.com/edu/learning/live-1440"
  }
]

export default function () {

  return (
    <Background background={theme.colors.white} pt={'20px'} pb={'20px'} width={1}>

      <div
        className="scf-box__header"
        style={{
        height: "100%",
        width: "76%",
        margin: "10px auto",
        alignItems: "flex-end",
        justifyContent: "space-between"
      }}>

        <div className="scf-box__header-title">
          <h3>视频</h3>
        </div>
        <div className="scf-box__header-more">
          <Link to="/resource">
            更多视频 &gt;
          </Link>
        </div>
      </div>
      <div
        className="scf-box__body"
        style={{
        height: "100%",
        width: "76%",
        margin: "10px auto",
        alignItems: "flex-end",
        justifyContent: "space-between"
      }}>
        <div className="scf-videos-grid">
          <div className="scf-grid__item-12">
            <div className="scf-grid__box">
              <div className="scf-video-item scf-video-item--block"><img src={VideoList[0].img} alt=""/>
                <div className="scf-video-item__info">
                  <a href={VideoList[0].link}>
                    <i className="scf-icon scf-icon-video"></i>
                  </a>
                  <span className="scf-video-item__title">{VideoList[0].title}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="scf-grid__item-12">
            <div className="scf-grid__box">
              <div className="scf-grid">
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-video-item "><img src={VideoList[1].img} alt=""/>
                      <a href={VideoList[1].link} className="scf-video-item__playbtn">
                        <i className="scf-icon scf-icon-video"></i>
                      </a>
                      <div className="scf-video-item__info">
                        <div className="scf-video-item__title">{VideoList[1].title}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-video-item "><img src={VideoList[2].img} alt=""/>
                      <a href={VideoList[2].link} className="scf-video-item__playbtn">
                        <i className="scf-icon scf-icon-video"></i>
                      </a>
                      <div className="scf-video-item__info">
                        <div className="scf-video-item__title">{VideoList[2].title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scf-grid">
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-video-item "><img src={VideoList[3].img} alt=""/>
                      <a href={VideoList[3].link} className="scf-video-item__playbtn">
                        <i className="scf-icon scf-icon-video"></i>
                      </a>
                      <div className="scf-video-item__info">
                        <div className="scf-video-item__title">{VideoList[3].title}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-video-item "><img src={VideoList[4].img} alt=""/>
                      <a href={VideoList[4].link} className="scf-video-item__playbtn">
                        <i className="scf-icon scf-icon-video"></i>
                      </a>
                      <div className="scf-video-item__info">
                        <div className="scf-video-item__title">{VideoList[4].title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Background>
  )
}
