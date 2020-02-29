import * as React from 'react'
import { Box, Row, Background, Container} from '@src/components/atoms'
import theme from '@src/constants/theme'
import {Link} from 'gatsby'
import './Activitys.css'
import * as classnames from 'classnames';

interface Activity {
  cover : string
  title : any
  decription : string
  link : string
}

const activityList : Activity[] = [
  {
    cover: "https://img.serverlesscloud.cn/20191227/1577413467740-v2-b65fcb6a94208a494005fc0c40a99eb6_1200x500.jpg",
    title: "荐书 | Serverless 架构：从原理、设计到项目实战1",
    decription: "安利一下 Serverless 中文技术社区成员 Anycodes 的大作",
    link: "/blog/2019-11-19-anycodes-book/"
  }, {
    cover: "https://main.qcloudimg.com/raw/8a0db1c9fd8b51c15d0b006291d52bf5.jpg",
    title: "2018 年社区调查：Serverless 使用率大幅增长",
    decription: "我们曾在开发社区进行问卷调查，询问 Serverless 的使用情况。它的使用率增长连我们自己都惊讶不已，下面来看看数据。",
    link: "/blog/2018-07-19-2018-serverless-community-survey-huge-growth-usage/"
  }, {
    cover: "https://main.qcloudimg.com/raw/5aa54033cfe5e0aa86ffde6b5ef0070e.png",
    title: "Serverless 数据解读：2018 报告",
    decription: "Serverless Framework 使用统计数据：事件源、服务结构、运行时长等等。",
    link: "/blog/2018-03-09-serverless-by-the-numbers-2018-data-report/"
  }
]

function ActivityCard({activity} : {
  activity: Activity
}) {
  return (
    <Box className="scf-article-item">
    <Link to={activity.link}>
      <Box className="scf-article-item__img">
        <img src={activity.cover} alt=""/>
      </Box>
      <Box className="scf-article-item__content">
        <Box className="scf-article-item__title">
          <h4>{activity.title}</h4>
        </Box>
        <Box className="scf-article-item__intro">
          {activity.decription}
        </Box>
      </Box>
      </Link>
    </Box>

  )
}

function ActivityCards() {
  return (
    <Box className="scf-box__body">
        {activityList.map(activity => (<ActivityCard key={activity.title} activity={activity}/>))}
    </Box>
  )
}

export default function () {
  return (
    <Box className="scf-grid__item-8">
    <Box className="scf-grid__box">
    <Box className="scf-box scf-home-active">
        <Box
          className="scf-box__header"
          >
          <Box className="scf-box__header-title size-s">
            <h3>活动</h3>
          </Box>
          <Box className="scf-box__header-more">
            <Link to="/category/news">
              更多活动 &gt;
            </Link>
          </Box>
        </Box>
        <ActivityCards/>
      </Box>
    </Box>
    </Box>
  )
}
