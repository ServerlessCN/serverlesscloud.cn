import * as React from 'react'
import Layout from '@src/layouts'
import { Box, Flex, Container, Background, Text } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import componentConfig from '@src/constants/componentConfig'
import Card from '@src/components/Card'
import { Link } from 'gatsby'
import theme from '@src/constants/theme'
import Breadcrumbs from '@src/components/Breadcrumbs'

const CustomContainer = styled(Container)`
  flex: 1;
`

interface Props {
  location: string
}

const ComponentPage = ({ location }: Props) => {
  return (
    <Layout>
      <Helmet
        title="组件 - Serverless"
        keywords="Serverless components,Serverless组件,Serverless案例"
        descirption="Serverless components 组件实战，快速上手Serverless框架组件能力，帮助上手Serverless最佳操作场景实战。"
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 组件</h1>
      <Breadcrumbs>组件</Breadcrumbs>
      <CustomContainer py="60px" maxWidth={[1216, 1216, 1216, '85%', '90%', 1216]}>
        <Flex justifyContent="space-around" flexWrap="wrap">
          {componentConfig.map(component => (
            <Link to={component.link} key={component.name}>
              <Card height="386px" width={[0.9, 0.9, 340, 360]}>
                <Background
                  width={[1]}
                  height={[200]}
                  background={`url(${JSON.stringify(component.thumbnail)})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                />
                <Box py="30px" px="20px">
                  <Text fontSize="18px" fontWeight="bold" mb="8px">
                    {component.slogan}
                  </Text>
                  <Text py={'5px'} fontSize="14px" lineHeight={1.75} mb="10px" color={theme.colors.gray[2]}>
                    {component.description}
                  </Text>
                  <Text color={theme.colors.serverlessRed} fontSize="14px">
                    查看详情&nbsp;>
                  </Text>
                </Box>
              </Card>
            </Link>
          ))}
        </Flex>
      </CustomContainer>
    </Layout>
  )
}

export default ComponentPage
