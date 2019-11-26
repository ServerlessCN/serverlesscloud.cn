import * as React from 'react'
import { Flex, Container } from '@src/components/atoms'
import { debounce } from '@src/utils'
import NavButton from './NavButton'
import NavList from './NavList'
import Logo from './Logo'

export default function({
  height,
  isDesktopView,
}: {
  height: string
  isDesktopView: boolean
}) {
  const [isNavButtonActive, setisNavButtonActive] = React.useState(false)

  React.useEffect(() => {
    const onResize = debounce(() => {
      if (window.innerWidth >= 992) {
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

  return (
    <Container
      width={1}
      px={0}
      maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}
    >
      <Flex alignItems="center" flexWrap="wrap" justifyContent="space-between">
        <Logo logoHeight={height} />

        <NavButton
          isDesktopView={isDesktopView}
          isActive={isNavButtonActive}
          onToggleActive={onToggleActive}
        />

        <NavList isDesktopView={isDesktopView} isActive={isNavButtonActive} />
      </Flex>
    </Container>
  )
}
