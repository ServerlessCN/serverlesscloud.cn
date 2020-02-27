
import * as React from 'react'
import {
  Flex,
  Row,
  Background,
  Container,
  Box,
  Center,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import { Link } from 'gatsby'
import ExternalLink from '@src/components/Link/ExternalLink'
import ComponentCard from './ComponentCard'
import componentConfig from '@src/constants/componentConfig'

export default function() {
  return (
      <Background pt={'40px'} pb={'20px'} width={1}>
         <Box className="scf-components-box">
            <Center flexDirection="column">
            <Row className="scf-box__header" 
                width="76%"
                height="100%"
                alignItems="flex-end"
                justifyContent="space-between"
                style={{marginTop: "-20px"}}>
                  <div className="scf-box__header-title"><h3>组件推荐</h3></div>
                  <div className="scf-box__header-more">
                  <ExternalLink to="https://serverless.com/cn/components/">
                  更多组件 &gt;
                  </ExternalLink>
                  </div>
                </Row> 

                <Container
                width={'76%'}
                maxWidth={['100%', '100%', '100%', '85%']}
              >
              <div className="scf-grid">  
                <Flex
                  flexDirection={['column', 'column', 'row', 'row', 'row']}
                  flexWrap={['initial', 'initial', 'wrap', 'wrap', 'initial']}
                  justifyContent={['initial', 'initial', 'center']}
                  width={[1]}
                  mb={[32, 32, 0]}
                  mt={[0, 0, 0]}
                >
                  {componentConfig.slice(0,3).map(blog=> (
                    <ComponentCard key={blog.name} blog={blog} />
                  ))}
                </Flex>
                <Flex
                  flexDirection={['column', 'column', 'row', 'row', 'row']}
                  flexWrap={['initial', 'initial', 'wrap', 'wrap', 'initial']}
                  justifyContent={['initial', 'initial', 'center']}
                  width={[1]}
                  mb={[32, 32, 0]}
                  mt={[0, 0, 0]}
                >
                  {componentConfig.slice(3,6).map(blog => (
                    <ComponentCard key={blog.name} blog={blog} />
                  ))}
                </Flex>
                </div>  
              </Container>

            </Center>
            </Box>
          </Background>
  )
}
