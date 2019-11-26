import * as React from 'react'
import {
  Flex,
  Column,
  Box,
  Container,
  Text,
  Background,
  Image,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import styled from 'styled-components'
import { Link as InternalLink } from 'gatsby'
import ExternalLink from './Link/ExternalLink'
import QQQRcode from '@src/assets/images/qq_qrcode.jpg'
import WechatQRcode from '@src/assets/images/wechat_qrcode.jpg'
import logo from '@src/assets/images/logo-serverless-framework-center-vertical-dark.png'

const links: {
  category: string
  contents: { title: string; link: string; isInternal?: boolean }[]
}[] = [
  {
    category: '资源',
    contents: [
      {
        title: 'Github',
        link: 'https://github.com/serverless/serverless',
      },
      {
        title: 'BLOG',
        link: '/blog',
        isInternal: true,
      },
      {
        title: '示例',
        link: 'https://github.com/serverless/examples',
      },
      {
        title: '书籍',
        link:
          'https://item.jd.com/12592747.html?cu=true&utm_source=kong&utm_medium=tuiguang&utm_campaign=t_1001542270_1001895103_0_1912401775&utm_term=ddc33d2bb10d4eafa032b3d0ffea1f6d',
      },
    ],
  },
  {
    category: '社区',
    contents: [
      {
        title: '知乎专栏',
        link: 'https://zhuanlan.zhihu.com/ServerlessGo',
      },
      {
        title: 'Twitter',
        link: 'https://twitter.com/goserverless',
      },
      {
        title: 'Serverless Summit',
        link: 'https://share.weiyun.com/5dFE6ND',
      },
      {
        title: '联系我们',
        link: '/about',
        isInternal: true,
      },
    ],
  },
  {
    category: '帮助',
    contents: [
      {
        title: '文档',
        link: '/doc',
        isInternal: true,
      },
      {
        title: '常见问题',
        link: '/doc/常见问题',
        isInternal: true,
      },
      {
        title: '报告 Bug',
        link:
          'https://github.com/serverless-tencent/serverless-tencent-scf/issues',
      },
      {
        title: '在线提问',
        link: 'https://segmentfault.com/t/serverlessframework',
      },
    ],
  },
]

const contacts = [
  {
    title: '交流QQ群',
    description: '玩转Serverless',
    type: 'qq',
    qrcode: QQQRcode,
  },
  {
    title: '小助手微信号',
    description: '微信扫码加入交流群',
    type: 'wechat',
    qrcode: WechatQRcode,
  },
]

const WhiteText = styled(Text)`
  color: ${theme.colors.white};
  font-size: 14px;
`

const WhiteTextWith16pxFontSize = styled(WhiteText)`
  font-size: 16px;
`

export default function() {
  return (
    <Column>
      <Background width={[1]} background={theme.colors.black}>
        <Container maxWidth={['100%', '100%', '100%', '1260px', '1260px']}>
          <Box pt={'40px'} pb={'30px'} pl={'10px'} pr={'10px'}>
            <Flex flexDirection={['column', 'column', 'column', 'row', 'row']}>
              <Box width={[1, 1, 1, 1 / 4]}>
                <Column>
                  <Image width={'180px'} src={logo} alt="Serverless" />
                  <WhiteText>极速部署 Serverless 应用的开发平台</WhiteText>
                </Column>
              </Box>

              {links.map(({ category, contents }) => (
                <Box
                  key={category}
                  width={[1, 1, 1, 1 / 6]}
                  ml={'10px'}
                  mr={'10px'}
                  mt={'40px'}
                >
                  <Column justifyContent="center">
                    <WhiteTextWith16pxFontSize mb={'20px'}>
                      {category}
                    </WhiteTextWith16pxFontSize>
                    {contents.map(({ title, link, isInternal }) => {
                      const Link = isInternal ? InternalLink : ExternalLink
                      return (
                        <Link key={title} to={link}>
                          <WhiteText mt={'5px'} mb="5px">
                            {title}
                          </WhiteText>
                        </Link>
                      )
                    })}
                  </Column>
                </Box>
              ))}

              {contacts.map(({ title, qrcode, description }) => (
                <Box
                  key={title}
                  width={[1, 1, 1, 1 / 6]}
                  ml={'10px'}
                  mr={'10px'}
                  mt={'40px'}
                >
                  <Column justifyContent="center">
                    <WhiteTextWith16pxFontSize mb={'20px'}>
                      {title}
                    </WhiteTextWith16pxFontSize>

                    <WhiteText mt={'5px'} mb="15px">
                      {description}
                    </WhiteText>

                    <Image
                      width={'128px'}
                      height={'128px'}
                      src={qrcode}
                      alt={`${title}_qrcode`}
                    />
                  </Column>
                </Box>
              ))}
            </Flex>
          </Box>
        </Container>
      </Background>

      <Background width={[1]} background={theme.colors.serverlessRed}>
        <Container maxWidth={['100%', '100%', '100%', '76%', '85%']}>
          <Box pt={'15px'} pb={'15px'} pl={'10px'} pr={'10px'}>
            <Flex
              flexDirection={['column', 'column', 'column', 'row', 'row']}
              justifyContent="space-between"
            >
              <WhiteText>
                Copyright &copy; 2019 ServerlessChina. All rights reserved
              </WhiteText>
              <WhiteText mt={['10px', '10px', '10px', 0, 0]}>
                made by
                ServerlessChina&nbsp;&nbsp;&nbsp;&nbsp;support@serverlesscn.com
              </WhiteText>
            </Flex>
          </Box>
        </Container>
      </Background>
    </Column>
  )
}
