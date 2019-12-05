import * as React from 'react'
import styled from 'styled-components'
import MetisMenu from './Metismenu'
import { DocMenu } from '@src/types'
import Link from './Link'
import ArrowIcon from '@src/assets/images/arrow-icon.svg'
import theme from '@src/constants/theme'

const Wrapper = styled.div`
  padding-top: 30px;
  .metismenu {
    background: ${theme.colors.white};
    font-size: 16px;
    overflow: hidden;
    position: relative;
    padding-left: 44px;
  }
  .metismenu > .metismenu-container > .metismenu-item > .metismenu-link {
    line-height: 2.5em;
  }

  .metismenu-link {
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.58px;
  }
  .metismenu
    > .metismenu-container
    > .metismenu-item
    > .metismenu-link
    .metismenu-state-icon {
    line-height: 2.5em;
  }

  .metismenu::after {
    content: ' ';
    pointer-events: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }
  .metismenu-container,
  .metismenu-item {
    margin: 0;
    padding: 0;
  }
  .metismenu-container {
    list-style: none;
  }
  .metismenu-container .metismenu-container {
    transition: padding 0.3s;
    -webkit-transition: padding 0.3s;
    background: rgba(255, 255, 255, 0.05);
  }
  .metismenu-container .metismenu-container .metismenu-item > .metismenu-link {
    height: 0;
    overflow: hidden;
  }
  .metismenu-container .metismenu-container .metismenu-link {
    padding-left: 1em;
  }

  .metismenu-container .metismenu-container .metismenu-link:hover {
    padding-left: 1em;
  }

  .metismenu-container
    .metismenu-container
    .metismenu-container
    .metismenu-link {
    padding-left: 1em;
  }
  .metismenu-container.visible {
    padding: 0.5em 0;
    padding-left: 1em;
  }
  .sls-root-menu + ul.visible {
    padding: 0 !important;
    padding-left: 1em !important;
  }
  .metismenu-container.visible > .metismenu-item > .metismenu-link {
    height: 2.5em;
  }
  .metismenu-link {
    color: ${theme.colors.black};
    transition: height 0.3s, color 0.3s, background-color 0.3s;
    -webkit-transition: height 0.3s, color 0.3s, background-color 0.3s;
    display: block;
    line-height: 2.5em;
    text-decoration: none;
  }
  .metismenu-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.serverlessRed};
  }

  .metismenu
    > .metismenu-container
    > .metismenu-item
    > .metismenu-link
    > .sls-dropdown-icon:after,
  .metismenu-container.visible
    > .metismenu-item
    > .metismenu-link
    > .sls-dropdown-icon:after {
    content: '';
    background: url(${ArrowIcon});
    background-size: cover;
    position: absolute;
    width: 10px;
    height: 8px;
    margin-top: 15px;
  }

  .metismenu-link.active {
    color: ${theme.colors.serverlessRed};
  }

  .metismenu-link.active:not(.sls-root-menu) {
    outline: none;
  }

  .metismenu-link:focus {
    outline: none;
  }

  .sls-root-menu .visible {
    border-left: 1px solid ${theme.colors.serverlessRed};
    padding-left: 1em;
  }

  i.metismenu-icon {
    text-align: center;
    width: 3em;
  }
  i.metismenu-state-icon {
    transition: transform 0.3s;
    -webkit-transition: transform 0.3s;
    float: right;
    line-height: 2.5em;
    text-align: center;
    width: 2em;
  }
`

export { DocMenu }

interface Props {
  menus: DocMenu[]
  activeLinkTo: string
}

export default function({ menus, activeLinkTo }: Props) {
  return (
    <Wrapper>
      <MetisMenu
        LinkComponent={Link}
        content={menus}
        activeLinkTo={activeLinkTo}
        iconNameStateVisible="dropdown-icon"
        iconNameStateHidden="dropdown-icon"
        iconNamePrefix="sls-"
      />
    </Wrapper>
  )
}
