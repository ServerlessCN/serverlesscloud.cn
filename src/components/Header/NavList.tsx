import * as React from 'react'
import { Box, List, Text, ListItemWithNoStyleType } from '@src/components/atoms'
import styled from 'styled-components'
import { display, color, textAlign, TextAlignProps } from 'styled-system'
import { Link } from 'gatsby'
import theme from '@src/constants/theme'

const NavListItem = styled(ListItemWithNoStyleType)`
  ${display}
  ${color}
  margin: 10px 10px;

  div {
    transition: all 0.3s ease;
  }

  &:hover {
    div {
      color: ${theme.colors.serverlessRed};
    }
  }
`

const BoxWithTextAlign = styled(Box)<TextAlignProps>`
  ${textAlign}
`

const navList: { title: string; link: string }[] = [
  {
    title: '主页',
    link: '/',
  },
  {
    title: '最佳实践',
    link: '/best-practice',
  },
  {
    title: '组件',
    link: '/component',
  },
  {
    title: '文档',
    link: '/doc',
  },
  {
    title: '博客',
    link: '/blog',
  },
  {
    title: '论坛',
    link: '/forum',
  },
  {
    title: '关于',
    link: '/about',
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
      bg={theme.colors.white}
      display={[
        isMobileNavListDisplay(),
        isMobileNavListDisplay(),
        isMobileNavListDisplay(),
        'block',
      ]}
      textAlign={isDesktopView ? 'right' : 'left'}
    >
      <List p={0} mr={0} mb={0}>
        {navList.map(({ title, link }, index) => (
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
              <Text color={theme.colors.black}>{title}</Text>
            </Link>
          </NavListItem>
        ))}
      </List>
    </BoxWithTextAlign>
  )
}
