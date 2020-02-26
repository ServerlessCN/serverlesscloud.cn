import * as React from 'react'
import {
  Flex,
  Column,
  Box,
  Container,
  Text,
  Background,
  Image,
  Row
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import {Link as InternalLink} from 'gatsby'
import ExternalLink from './Link/ExternalLink'
import QQQRcode from '@src/assets/images/qq_qrcode.png'
import WechatQRcode from '@src/assets/images/wechat_qrcode.png'
import logo from '@src/assets/images/icon-serverless-framework.png'
import './Footer.css'

const links : {
  category : string
  contents : {
    title: string;
    link: string;
    isInternal?: boolean
  }[]
}[] = [
  {
    category: '资源',
    contents: [
      {
        title: 'GitHub',
        link: 'https://github.com/serverless/serverless'
      }, {
        title: '博客',
        link: '/blog',
        isInternal: true
      }, {
        title: '示例',
        link: 'https://github.com/serverless/examples'
      }, {
        title: '书籍',
        link: 'https://item.jd.com/12592747.html?cu=true&utm_source=kong&utm_medium=tuiguang&ut' +
            'm_campaign=t_1001542270_1001895103_0_1912401775&utm_term=ddc33d2bb10d4eafa032b3d' +
            '0ffea1f6d'
      }
    ]
  }, {
    category: '社区',
    contents: [
      {
        title: '知乎专栏',
        link: 'https://zhuanlan.zhihu.com/ServerlessGo'
      }, {
        title: 'Twitter',
        link: 'https://twitter.com/goserverless'
      }, {
        title: 'Serverless Summit',
        link: 'https://share.weiyun.com/5dFE6ND'
      }
    ]
  }, {
    category: '帮助',
    contents: [
      {
        title: '文档',
        link: '/doc',
        isInternal: true
      }, {
        title: '常见问题',
        link: '/doc/questions',
        isInternal: true
      }, {
        title: '报告 Bug',
        link: 'https://github.com/serverless-tencent/serverless-tencent-scf/issues'
      }, {
        title: '在线提问',
        link: 'https://segmentfault.com/t/serverlessframework'
      }, {
        title: '联系我们',
        link: '/about',
        isInternal: true
      }
    ]
  }
]

const contacts = [
  {
    title: '交流 QQ群',
    description: '群号：871445853',
    type: 'qq',
    qrcode: QQQRcode
  }, {
    title: '小助手微信号',
    description: '扫码加入交流群',
    type: 'wechat',
    qrcode: WechatQRcode
  }
]

const WhiteText = styled(Text)`
  color: ${theme.colors.white};
  font-size: 14px;
`

const WhiteTextWith16pxFontSize = styled(WhiteText)`
  font-size: 16px;
`

export default function () {
  return (
    <Column>
      <Background width={[1]} background={theme.colors.gray[0]}>
        <div className="scf-footer">
          <div className="scf-footer__inner">
            <div className="scf-footer__left">
              <div className="scf-display-flex">
                {links.map(({category, contents}) => (
                  <dl className="scf-footer__link">
                    <dt className="scf-footer__link-title">{category}</dt>
                    <dd className="scf-footer__link-list">
                      <ul>
                        {contents.map(({title, link, isInternal}) => {
                          const Link = isInternal
                            ? InternalLink
                            : ExternalLink
                          return (
                            <li>
                              <Link key={title} to={link}>
                                {title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </dd>
                  </dl>
                ))}
              </div>
            </div>
            <div className="scf-footer__right">
              <div className="scf-display-flex scf-footer__commit">
                {contacts.map(({title, qrcode, description}) => (
                  <dl className="scf-footer__link ">
                    <dt className="scf-footer__link-title">{title}</dt>
                    <dd className="scf-footer__link-list">
                      <p className="scf-footer__commit-tips">{description}</p>
                      <img src={qrcode} alt=""/>
                    </dd>
                  </dl>
                ))}
              </div>
            </div>
          </div>
          <div className="scf-footer__inner">
            <div className="scf-footer__left">
              <div className="scf-logo-wrap">
                <span className="scf-logo-zh is-dark"></span>
                <span className="scf-logo-wrap__text">中文网</span>
              </div>
            </div>
            <div className="scf-footer__right">
              <div className="scf-footer__channel">
                <a href="##">
                  <i className="scf-icon scf-icon-wechat"></i>
                </a>
                <a href="##">
                  <i className="scf-icon scf-icon-qq"></i>
                </a>
                <a href="##">
                  <i className="scf-icon scf-icon-zhihu"></i>
                </a>
                <a href="##">
                  <i className="scf-icon scf-icon-twitter"></i>
                </a>
                <a href="##">
                  <i className="scf-icon scf-icon-github"></i>
                </a>
              </div>
              <p className="scf-footer__copyright">hello@serverlesscloud.cn - Copyright © 2020 ServerlessCloud. All rights reserved</p>
              <p className="scf-footer__copyright">Powered by Serverless Framework</p>
            </div>
          </div>

        </div>
      </Background>
      <script src="https://zz.bdstatic.com/linksubmit/push.js"></script>
      <script src="https://push.zhanzhang.baidu.com/push.js"></script>
    </Column>
  )
}
