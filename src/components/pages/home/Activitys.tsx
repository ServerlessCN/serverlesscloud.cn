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
    cover: 'https://img.serverlesscloud.cn/2020826/1598412575104-10years.jpg',
    title: '腾讯云十周年庆 | Serverless 回馈豪礼',
    decription: '惊喜就藏在云产品主会场的「基础云产品区」和「企业新用户专区」！',
    link: 'https://cloud.tencent.com/act/anniversary/product',
  },
  {
    cover: 'https://img.serverlesscloud.cn/2020720/1595233528915-1588164013282-banner_hours%20%281%29.jpg',
    title: 'Tencent Serverless Hours | 第十期',
    decription: 'Serverless 网站托管和备案一站式服务体验',
    link: '/blog/2020-09-11-webinar-meetup',
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
