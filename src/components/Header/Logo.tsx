import * as React from 'react'
import logo from '@src/assets/images/logo-serverless-framework-side-light.png'
import { Logo } from '@src/components/atoms'
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
      <LogoWithMargin src={logo} alt="Serverless" height={logoHeight} />
    </LinkWithMargin>
  )
}
