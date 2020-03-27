import * as React from 'react'
import {
  Row,
  Background,
  Container,
  Image,
  InlineBlock,
} from '@src/components/atoms'
import { Link as GatsbyLink } from 'gatsby'
import theme from '@src/constants/theme'
import imgTwitter from '@src/assets/images/twitter-icon.svg'
import imgTwitterWhite from '@src/assets/images/twitter-icon-white.svg'
import imgGithub from '@src/assets/images/github-icon.svg'
import imgGithubWhite from '@src/assets/images/github-icon-white.svg'
import imgQQ from '@src/assets/images/qq-icon.svg'
import imgQQWhite from '@src/assets/images/qq-icon-white.svg'
import imgWechat from '@src/assets/images/wechat-icon.svg'
import imgWechatWhite from '@src/assets/images/wechat-icon-white.svg'
import imgZhihu from '@src/assets/images/zhihu-icon.svg'
import imgZhihuWhite from '@src/assets/images/zhihu-icon-white.svg'
import styled from 'styled-components'

import ExternalLink from '@src/components/Link/ExternalLink'

const IconBox = styled(InlineBlock)`
  .icon {
    transition: all 0.3s ease;
  }

  .icon-hide {
    display: none;
  }

  &:hover {
    .icon {
      display: none;
    }

    .icon-hide {
      display: block;
    }
  }
`

const entrances: {
  type: 'github' | 'twitter' | 'qq' | 'wechat' | 'zhihu'
  img: any
  hoverImg: any
  link: string
  inInnerLink?: boolean
}[] = [
  {
    type: 'github',
    img: imgGithub,
    hoverImg: imgGithubWhite,
    link: 'https://github.com/serverless/serverless',
  },
  {
    type: 'twitter',
    img: imgTwitter,
    hoverImg: imgTwitterWhite,
    link: 'https://twitter.com/goserverless',
  },
  {
    type: 'zhihu',
    img: imgZhihu,
    hoverImg: imgZhihuWhite,
    link: 'https://zhuanlan.zhihu.com/ServerlessGo',
  },
  {
    type: 'wechat',
    img: imgWechat,
    hoverImg: imgWechatWhite,
    link: '/about#联系方式',
    inInnerLink: true,
  },
  {
    type: 'qq',
    img: imgQQ,
    hoverImg: imgQQWhite,
    link: '/about#联系方式',
    inInnerLink: true,
  },
]

export default function() {
  const iconBoxCommonProps = {
    mx: '5px',
    width: '20px',
    height: '20px',
  }

  const iconCommonProps = {
    width: 1,
    height: '100%',
  }

  return (
    <Background width={1} height="30px" background={theme.colors.black}>
      <Container
      width={[1, 1, 1, 912, 0.76, 1200]}
        height="100%"
        px={0}
        // maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}
      >
        <Row height="100%" alignItems="center" justifyContent="flex-end">
          <Row>
            {entrances.map(({ img, hoverImg, type, link, inInnerLink }) => {
              const Link = inInnerLink ? GatsbyLink : ExternalLink

              return (
                <IconBox {...iconBoxCommonProps} key={type}>
                  <Link to={link}>
                    <Image
                      {...iconCommonProps}
                      className={`icon`}
                      alt={type}
                      src={img}
                    />
                    <Image
                      {...iconCommonProps}
                      className={`icon-hide`}
                      alt={type}
                      src={hoverImg}
                    />
                  </Link>
                </IconBox>
              )
            })}
          </Row>
        </Row>
      </Container>
    </Background>
  )
}
