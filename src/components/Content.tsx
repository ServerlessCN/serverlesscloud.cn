import * as React from 'react'
import { Box, Flex, Container } from '@src/components/atoms'
import styled from 'styled-components'
import { width } from 'styled-system'

const CustomFlex = styled(Flex)`
  ${width}
`

const CustomContainer = styled(Container)`
  flex: 1;
`

export default function(props: React.Props<any>) {
  const { children } = props
  return (
    <CustomContainer
      width={[1, 1, 1, 1, 1216]}
      maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}
    >
      <CustomFlex
        width={1}
        alignItems={['center', 'center', 'center', 'flex-start']}
        justifyContent={['center', 'center', 'center', 'space-between']}
        flexDirection={['column', 'column', 'column', 'row']}
      >
        {children}
      </CustomFlex>
    </CustomContainer>
  )
}
