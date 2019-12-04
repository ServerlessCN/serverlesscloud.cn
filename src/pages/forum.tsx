import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import Banner from '@src/components/Banner'
import Markdown from '@src/components/Markdown'
import {
  Box,
  Flex,
  Container,
  Text,
  Column,
  Image,
} from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import WechatQRcode from '@src/assets/images/wechat_qrcode.jpg'

const CustomContainer = styled(Container)`
  flex: 1;
  display: flex;
  padding: 30px;
`

interface Props {
  location: any
}

const ForumPage = ({ location }: Props) => {
  return (
    <Layout>
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="关于Serverless - Serverless"
        location={location}
      />

      <CustomContainer maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}>
        <Column justifyContent="center" alignItems="center">
          <Text mb="20px" fontSize="24px">
            论坛正在建设中，将于近期发布。您可以扫描下方二维码，加入Serverless技术群进行交流。{' '}
          </Text>

          <Image
            width="200px"
            height="200px"
            src={WechatQRcode}
            alt={`wechat_qrcode`}
          />
        </Column>
      </CustomContainer>
    </Layout>
  )
}

export default ForumPage
