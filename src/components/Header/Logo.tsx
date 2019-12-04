import * as React from 'react'
import logo from '@src/assets/images/logo-serverless-framework-side-light.png'
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
      <Row alignItems="center">
        <LogoWithMargin
          src={logo}
          alt="Serverless Framework"
          height={logoHeight}
        />

        <Text ml="5px" fontSize="20px" fontWeight="bold">
          Serverless中文技术社区
        </Text>
      </Row>
    </LinkWithMargin>
  )
}
