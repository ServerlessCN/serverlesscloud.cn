import * as React from 'react'
import styled from 'styled-components'
import MetisMenu from './Metismenu'
import { DocMenu } from '@src/types'
import Link from './Link'
import ArrowIcon from '@src/assets/images/arrow-icon.svg'

const Wrapper = styled.div`
  .metismenu {
    font-size: 16px;
    overflow: hidden;
    position: relative;
    padding: 10px;
  }
  .metismenu > .metismenu-container > .metismenu-item > .metismenu-link {
    line-height: 2.5em;
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
    transition: padding 300ms;
    -webkit-transition: padding 300ms;
    background: rgba(255, 255, 255, 0.05);
  }
  .metismenu-container .metismenu-container .metismenu-item > .metismenu-link {
    height: 0;
    overflow: hidden;
  }
  .metismenu-container .metismenu-container .metismenu-link {
    padding-left: 1em;
  }
  .metismenu-container
    .metismenu-container
    .metismenu-container
    .metismenu-link {
    padding-left: 2em;
  }
  .metismenu-container.visible {
    padding: 0.5em 0;
  }
  .metismenu-container.visible > .metismenu-item > .metismenu-link {
    height: 2.5em;
  }
  .metismenu-link {
    color: #333;
    transition: height 300ms, color 300ms, background-color 300ms;
    -webkit-transition: height 300ms, color 300ms, background-color 300ms;
    display: block;
    line-height: 2.5em;
    text-decoration: none;
  }
  .metismenu-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fd5750;
  }
  .metismenu-link.active {
    color: #fd5750;
  }
  .metismenu-link:focus {
    outline: none;
  }
  .metismenu-link.has-active-child {
    color: #fd5750;
  }

  .sls-dropdown-icon {
    line-height: 2.5em;
    transition: transform 0.3s;
    -webkit-transition: transform 0.3s;
    float: right;
    text-align: center;
    width: 2em;
  }
  .sls-dropdown-icon:after {
    content: '';
    background: url(${ArrowIcon});
    background-size: cover;
    position: absolute;
    width: 10px;
    height: 8px;
    margin-top: 15px;
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
