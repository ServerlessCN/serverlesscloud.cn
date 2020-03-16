import * as React from 'react'

import { Box, Image, Text, Container } from '@src/components/atoms'
import NavList from './NavList'
import closeIcon from '@src/assets/images/close.png'
import mobileMenuIcon from '@src/assets/images/navbar_menu.svg'

interface Props {
  isActive: boolean
  isDesktopView: boolean
  onToggleActive: (isActive: boolean) => void
}

// export default function({ isActive, onToggleActive, isDesktopView }: Props) {
export default class NavButton extends React.Component<Props, State> {
  constructor(props) {
    super(props)
  }
  render() {
    const { isActive, isDesktopView, onToggleActive, navListObject } = this.props
    return (
      <Container
        className="scf-container-header-btn"
        >
      <Box
        className="scf-box-header-menus-icon scf-box-header-menus-icon-normal"
        id="scf-box-header-menus-icon"
        height="26px"
        width="26px"
        mr="10px"
        display={
          isDesktopView ? 'none' : ['flex', 'flex', 'flex', 'flex', 'none']
        }
        onClick={() => {
          const headerBtns = document.getElementsByClassName('scf-container-header-btn');
          if (!headerBtns) return;
          const menus = headerBtns[0].getElementsByClassName('scf-box-header-menus-icon');
          if (!menus) return;
          const navIcon = menus[0];
          // const navIcon = document.getElementById('scf-box-header-menus-icon');
          const searchIcon = document.getElementById('scf-bar-header-search-icon');
          if (!isActive) {
            if (searchIcon) searchIcon.style.display = 'none';
            navIcon.classList.remove('scf-box-header-icon-normal')
            navIcon.classList.add('scf-box-header-icon-close')
          } else {
            if (searchIcon) searchIcon.style.display = 'block';
            navIcon.classList.add('scf-box-header-menus-icon-normal')
            navIcon.classList.remove('scf-box-header-icon-close')
          }
          onToggleActive && onToggleActive(!isActive)

        }}
      >
        {/*<Image
                  height="26px"
                  width="26px"
                  src={isActive ? closeIcon : mobileMenuIcon}
                />*/}
        
      </Box>

        <Text 
          onClick={() => {
            onToggleActive && onToggleActive(!isActive)
            // const navIcon = document.getElementById('scf-box-header-menus-icon');
            const headerBtns = document.getElementsByClassName('scf-container-header-btn');
            if (!headerBtns) return;
            const menus = headerBtns[0].getElementsByClassName('scf-box-header-menus-icon');
            if (!menus) return;
            const navIcon = menus[0];
            const searchIcon = document.getElementById('scf-bar-header-search-icon');
            if (!isActive) {
              if (navIcon) navIcon.style.display = 'none';
              searchIcon.classList.add('scf-bar-header-search-icon-close');
              searchIcon.classList.remove('scf-bar-header-search-icon-normal');
            } else {
              if (navIcon) navIcon.style.display = 'block';
              searchIcon.classList.remove('scf-bar-header-search-icon-close');
              searchIcon.classList.add('scf-bar-header-search-icon-normal');
            }
            navListObject.changeSearch && navListObject.changeSearch()
          }}
          className="scf-bar-header-search-icon scf-bar-header-search-icon-normal" 
          id="scf-bar-header-search-icon" 
          style={{ fontSize: 15 }}
              >
                
              </Text>
      </Container>
    )
  }
}
