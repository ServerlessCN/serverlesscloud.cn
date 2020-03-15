import * as React from 'react'

import { Box, Image } from '@src/components/atoms'

import closeIcon from '@src/assets/images/close.png'
import mobileMenuIcon from '@src/assets/images/navbar_menu.svg'

interface Props {
  isActive: boolean
  isDesktopView: boolean
  onToggleActive: (isActive: boolean) => void
}

export default function({ isActive, onToggleActive, isDesktopView }: Props) {
  return (
    <Box
      height="26px"
      width="26px"
      mr="10px"
      display={
        isDesktopView ? 'none' : ['flex', 'flex', 'flex', 'flex', 'none']
      }
      onClick={() => {
        onToggleActive && onToggleActive(!isActive)
      }}
    >
      <Image
        height="26px"
        width="26px"
        src={isActive ? closeIcon : mobileMenuIcon}
      />
    </Box>
  )
}
