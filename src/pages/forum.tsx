import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Box, Container, Text, Column, Image, TextP } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import WechatQRcode from '@src/assets/images/wechat_qrcode.png'

const CustomContainer = styled(Container)`
  flex: 1;
  // display: flex;
  padding: 30px;
  text-align: center;
  margin-top: 0px;
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
        title="论坛 - Serverless"
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 论坛</h1>
      <CustomContainer maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}>
        <div id="scf-box-mobile-titlebar" className="scf-box__header-title">
          <h3>论坛</h3>
        </div>
        <Box justifyContent="center" alignItems="center" align="center">
          <Text align="center" mb="20px" fontSize="24px" lineHeight={1.5}>
            论坛正在建设中，将于近期发布。
            <TextP>您可以扫描下方二维码，加入 Serverless 技术群进行交流。 </TextP>
          </Text>

          <Image width="200px" height="200px" src={WechatQRcode} alt={`wechat_qrcode`} />
        </Box>
      </CustomContainer>
    </Layout>
  )
}

export default ForumPage
