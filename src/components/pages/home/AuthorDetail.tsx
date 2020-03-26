import * as React from 'react'
import {Box} from '@src/components/atoms'
import {Link} from 'gatsby'
import './AuthorDetail.css'

interface Activity {
  cover : string
  title : any
  decription : string
  link : string
}

const activityList : Activity[] = [
  {
    cover: "https://img.serverlesscloud.cn/20191227/1577413467740-v2-b65fcb6a94208a494005fc0" +
        "c40a99eb6_1200x500.jpg",
    title: "荐书 | Serverless 架构：从原理、设计到项目实战1",
    decription: "安利一下 Serverless 中文技术社区成员 Anycodes 的大作",
    link: "/blog/2019-11-19-anycodes-book/"
  }, {
    cover: "https://main.qcloudimg.com/raw/8a0db1c9fd8b51c15d0b006291d52bf5.jpg",
    title: "2018 年社区调查：Serverless 使用率大幅增长",
    decription: "我们曾在开发社区进行问卷调查，询问 Serverless 的使用情况。它的使用率增长连我们自己都惊讶不已，下面来看看数据。",
    link: "/blog/2018-07-19-2018-serverless-community-survey-huge-growth-usage/"
  }, {
    cover: "https://main.qcloudimg.com/raw/3cb7b20955d78ced738e0279bb3f6f41.jpg",
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
      <p className="scf-activity__content">不论您是行业大会主办方，还是垂直技术沙龙发起者，我们都欢迎您与 Serverless 中文网进行合作。技术共享，共建生态，Serverless
        探索之路，我们携手同行。您可以添加微信 (WeChat ID: jiangliu_0418) 与我们进一步交流。</p>
    </Box>
  )
}

export default function () {
  return (
    <Box className="scf-grid__item-8">
      <Box className="scf-grid__box scf-meetup-author">
        <Box className="scf-box scf-home-active">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title size-s">
              <h3>交流合作</h3>
            </Box>
          </Box>
          <ActivityCards/>
        </Box>
      </Box>
    </Box>
  )
}
