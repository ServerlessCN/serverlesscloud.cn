import * as React from 'react'
import { Flex, Container } from '@src/components/atoms'
import { debounce } from '@src/utils'
import ExternalLink from '../Link/ExternalLink'
import NavButton from './NavButton'
import NavList from './NavList'
import Logo from './Logo'
import theme from '@src/constants/theme'

export default function({ height, isDesktopView }: { height: string; isDesktopView: boolean }) {
  const [isNavButtonActive, setisNavButtonActive] = React.useState(false)

  React.useEffect(() => {
    const onResize = debounce(() => {
      if (window.innerWidth >= 1001) {
        setisNavButtonActive(false)
      } else {
        // do nothing
      }
    }, 50)

    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const onToggleActive = isActive => {
    setisNavButtonActive(isActive)
  }

  const [navListObject, setnavListObject] = React.useState(null)
  function onRef(input) {
    setnavListObject(input)
  }

  return (
    <Container
      width={[1, 1, 1, 912, 0.76, 1200]}
      px={0}
      // maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]
    >
      <Flex alignItems="center" flexWrap="wrap" justifyContent="space-between">
        <Logo logoHeight={height} />
        <NavList
          ref={i => {
            onRef(i)
          }}
          isDesktopView={isDesktopView}
          isActive={isNavButtonActive}
        />
        <NavButton
          navListObject={navListObject}
          isDesktopView={isDesktopView}
          isActive={isNavButtonActive}
          onToggleActive={onToggleActive}
        />
      </Flex>
    </Container>
  )
}
