import * as React from 'react'
import { Box } from '@src/components/atoms'
import { Link } from 'gatsby'
import './AuthorDetail.css'

interface Activity {
  cover: string
  title: any
  decription: string
  link: string
}

const activityList: Activity[] = [
  {
    cover:
      'https://img.serverlesscloud.cn/20191227/1577413467740-v2-b65fcb6a94208a494005fc0' + 'c40a99eb6_1200x500.jpg',
    title: 'Tencent Serverless Hours | 第十期',
    decription: 'Serverless 网站托管和备案一站式服务体验',
    link: '/blog/2020-09-11-webinar-meetup',
  },
  {
    cover: 'https://main.qcloudimg.com/raw/3cb7b20955d78ced738e0279bb3f6f41.jpg',
    title: '2018 年社区调查：Serverless 使用率大幅增长',
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
      <p className="scf-activity__content">
        Serverless 中文社区由开发者和技术爱好者发起，致力于分享 Serverless 知识和技术，探讨技术落地和未来发展。
      </p>
      <p className="scf-activity__content">
        我们欢迎更多志同道合者一起贡献 Serverless 技术的知识和实践。Serverless
        期待与您任何形式的社区交流、开源协作、内容共建、活动合作。
      </p>
      <p className="scf-activity__content">微信联系：ServerlessCloud</p>
    </Box>
  )
}

export default function() {
  return (
    <Box className="scf-grid__item-8">
      <Box className="scf-grid__box scf-meetup-author">
        <Box className="scf-box scf-home-active">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title size-s">
              <h3>交流合作</h3>
            </Box>
          </Box>
          <ActivityCards />
        </Box>
      </Box>
    </Box>
  )
}
