import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Container, Text, Column, Image, TextP } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import WechatQRcode from '@src/assets/images/wechat_qrcode.png'

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
          <Text align="center" mb="20px" fontSize="24px" lineHeight={1.5}>
            论坛正在建设中，将于近期发布。
            <TextP>您可以扫描下方二维码，加入Serverless技术群进行交流。 </TextP>
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
