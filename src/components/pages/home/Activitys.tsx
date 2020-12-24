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
    cover: 'https://img.serverlesscloud.cn/20201118/1605688310413-a439663e77e045899725dc094b393d6e_tplv-k3u1fbpfcp-watermark.jpg',
    title: '万物皆可 Serverless！',
    decription: '掘金 x Serverless 中文社区联合征文',
    link: 'https://serverlesscloud.cn/blog/2020-11-16-juejin',
  },
  {
    cover: 'https://img.serverlesscloud.cn/2020720/1595233528915-1588164013282-banner_hours%20%281%29.jpg',
    title: 'Tencent Serverless Hours | 第 13 期',
    decription: '腾讯云 Serverless 云函数支持在线调试功能',
    link: '/blog/2020-12-29-webinar-meetup',
  },
  {
    cover: 'https://main.qcloudimg.com/raw/3cb7b20955d78ced738e0279bb3f6f41.jpg',
    title: '社区调查：Serverless 使用率大幅增长',
    decription: '在开发社区进行的问卷调查，Serverless 的使用率增长连我们自己都惊讶不已！',
    link: '/blog/2018-07-19-2018-serverless-community-survey-huge-growth-usage/',
  },
]

function ActivityCard({ activity }: { activity: Activity }) {
  const isExternal = activity.link.startsWith('https://')
  const main = (
    <React.Fragment>
      <Box className="scf-article-item__img">
        <img src={activity.cover} alt={activity.title} />
      </Box>
      <Box className="scf-article-item__content">
        <Box className="scf-article-item__title">
          <h4>{activity.title}</h4>
        </Box>
        <Box className="scf-article-item__intro">{activity.decription}</Box>
      </Box>
    </React.Fragment>
  )
  return (
    <Box className="scf-article-item">
      {isExternal ? (
        <a href={activity.link} target="_blank">
          {main}
        </a>
      ) : (
        <Link to={activity.link}>{main}</Link>
      )}
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
