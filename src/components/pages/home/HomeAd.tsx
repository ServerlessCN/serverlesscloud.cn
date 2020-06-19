import * as React from 'react'
import { Box, Container } from '@src/components/atoms'
import './HomeAd.less'

export default function() {
  return (
    <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0} pt={0}>
      <Box className="scf-grid">
        <Box className="scf-grid__item-24">
          <a
            href="https://serverless.cloud.tencent.com/deploy/express"
            target="_blank"
            className="home-ad-con"
            onClick={() => MtaH5.clickStat('ad_home')}
          >
            <img
              className="home-ad"
              src="//img.serverlesscloud.cn/2020618/1592471447152-home-ad.png"
              alt="首页广告位"
            />
          </a>
        </Box>
      </Box>
    </Container>
  )
}
