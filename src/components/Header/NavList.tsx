import * as React from 'react'
import { Box, List, Text, ListItemWithNoStyleType } from '@src/components/atoms'
import styled from 'styled-components'
import { display, color, textAlign, TextAlignProps } from 'styled-system'
import {Link as InternalLink} from 'gatsby'
import ExternalLink from '../Link/ExternalLink'
import theme from '@src/constants/theme'

const NavListItem = styled(ListItemWithNoStyleType)`
  ${display}
  ${color}

  div {
    transition: all 0.3s ease;
    padding: 0 20px;
    font-size: 15px;
  }

  &:hover {
    div {
      color: ${theme.colors.white};
    }
  }
`

const BoxWithTextAlign = styled(Box)<TextAlignProps>`
  ${textAlign}
`

const navList: { title: string; link: string;isInternal?: boolean }[] = [
  {
    title: '最佳实践',
    link: '/best-practice',
    isInternal: true
  },
  {
    title: '组件',
    link: 'https://serverless.com/cn/components/',
  },
  {
    title: '文档',
    link: 'https://serverless.com/cn/framework/docs/',
  },
  {
    title: '博客',
    link: '/blog',
    isInternal: true
  },
  {
    title: '资源',
    link: '/resource',
    isInternal: true
  },
  {
    title: '论坛',
    link: '/forum',
    isInternal: true
  },
  {
    title: '关于',
    link: '/about',
    isInternal: true
  },
]

interface Props {
  isActive: boolean
  isDesktopView: boolean
}

export default function({ isActive, isDesktopView }: Props) {
  const isMobileNavListDisplay = () => (isActive ? 'block' : 'none')

  const navListBoxWidth = isDesktopView ? 0.6 : 1
  return (
    <BoxWithTextAlign
      width={navListBoxWidth}
      bg={theme.colors.black}
      display={[
        isMobileNavListDisplay(),
        isMobileNavListDisplay(),
        isMobileNavListDisplay(),
        'block',
        'block',
        'block',
        'block',
      ]}
      textAlign={isDesktopView ? 'right' : 'left'}
    >
      <List p={0} mr={0} mb={0}>
        {navList.map(({ title, link, isInternal }, index) =>{ 
          const Link = isInternal
          ? InternalLink
          : ExternalLink
          return(
          <NavListItem
            onClick={() => {
              if (link === '/') {
                ;(window as any).MtaH5.clickStat('homelink')
              }
            }}
            key={index}
            display={['block', 'block', 'block', 'inline-block']}
          >
            <Link to={link}>
              <Text color={theme.colors.gray_text} style={{fontSize:15}}>{title}</Text>
            </Link>
          </NavListItem>
        )})}
        {/*<NavListItem
        // onClick={() => {
          
        // }}
        key={'search'}
        display={['block', 'block', 'block', 'inline-block']}
      >
          <Text color={theme.colors.gray_text} style={{fontSize:15}}>搜索</Text>
          </NavListItem>
        */}
      </List>
    </BoxWithTextAlign>
  )
}
