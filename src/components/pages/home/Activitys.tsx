import * as React from 'react'
import { Box } from '@src/components/atoms'
import { Link } from 'gatsby'
import './Activitys.css'

interface Activity {
  cover: string
  title: any
  decription: string
  link: string
}

const activityList: Activity[] = [
  {
    cover: 'https://img.serverlesscloud.cn/20191227/1577413467740-v2-b65fcb6a94208a494005fc0c40a99eb6_1200x500.jpg',
    title: '荐书 | Serverless 架构：从原理、设计到项目实战',
    decription: '安利一下 Serverless 中文技术社区成员 Anycodes 的大作',
    link: '/blog/2019-11-19-anycodes-book/',
  },
  {
    cover: 'https://main.qcloudimg.com/raw/3cb7b20955d78ced738e0279bb3f6f41.jpg',
    title: '社区调查：Serverless 使用率大幅增长',
    decription: '我们在开发社区进行的问卷调查，Serverless 的使用率增长连我们自己都惊讶不已！',
    link: '/blog/2018-07-19-2018-serverless-community-survey-huge-growth-usage/',
  },
  {
    cover: 'https://img.serverlesscloud.cn/2020514/1589460703762-zg.jpg',
    title: 'Serverless 中文社区有奖征稿',
    decription: '欢迎分享您的技术实践和开发经验！',
    link: '/blog/2020-04-15-article-meetup/',
  },
]

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Box className="scf-article-item">
      <Link to={activity.link}>
        <Box className="scf-article-item__img">
          <img src={activity.cover} alt={activity.title} />
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__title">
            <h4>{activity.title}</h4>
          </Box>
          <Box className="scf-article-item__intro">{activity.decription}</Box>
        </Box>
      </Link>
    </Box>
  )
}

function ActivityCards() {
  return (
    <Box className="scf-box__body">
      {activityList.map(activity => (
        <ActivityCard key={activity.title} activity={activity} />
      ))}
    </Box>
  )
}

export default function() {
  return (
    <Box className="scf-grid__item-8">
      <Box className="scf-grid__box">
        <Box className="scf-box scf-home-active">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title size-s">
              <h3>活动</h3>
            </Box>
          </Box>
          <ActivityCards />
        </Box>
      </Box>
    </Box>
  )
}
