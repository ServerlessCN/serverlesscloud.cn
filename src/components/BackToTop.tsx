import * as React from 'react'
import { Fixed, Button } from '@src/components/atoms'

import theme from '@src/constants/theme'
import { debounce } from '@src/utils'

export default function() {
  const [isBackTopButtonShow, setIsBackTopButtonShow] = React.useState(false)

  React.useEffect(() => {
    const onScroll = debounce(() => {
      const scrollTop = document.documentElement.scrollTop

      const clientHeight = document.documentElement.clientHeight

      if (scrollTop > clientHeight) {
      }

      setIsBackTopButtonShow(!!(scrollTop > clientHeight))
    }, 50)

    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Fixed right="30px" bottom="100px">
      {isBackTopButtonShow ? (
        <Button
          onClick={() => {
            document.documentElement.scrollTop = 0
          }}
          width="120px"
          fontSize="16px"
          p={'10px'}
          theme={theme}
        >
          回到顶部
        </Button>
      ) : null}
    </Fixed>
  )
}
