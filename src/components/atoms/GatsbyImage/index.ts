import React from 'react'
import Img from 'gatsby-image'
import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'

export interface Props extends SpaceProps {}

export const GatsbyImg = styled(Img)<Props>`
  ${space}
`
