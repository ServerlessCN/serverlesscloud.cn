import * as React from 'react'
import logo from '@src/assets/images/icon-serverless-framework.png'

import { Logo, Text, Row } from '@src/components/atoms'
import styled from 'styled-components'
import { Link } from 'gatsby'

const LogoWithMargin = styled(Logo)`
  margin: 0 0 0 10px;
`

const LinkWithMargin = styled(Link)`
  margin: 0 0 0 10px;
`

interface Props {
  logoHeight: string
}

export default function({ logoHeight }: Props) {
  return (
    <LinkWithMargin to="/">
      <Row alignItems="center" height={logoHeight}>
        <LogoWithMargin
          height={`${parseInt(logoHeight) * 0.8}px`}
          src={logo}
          alt="Serverless Framework"
        />

        <Text ml="5px" fontSize={['14px', '14px', '16px', '20px']}>
          Serverless 中文技术社区
        </Text>
      </Row>
    </LinkWithMargin>
  )
}
