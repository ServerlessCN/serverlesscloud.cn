import * as React from 'react'
import { adBanner } from '@src/constants/ad_banner'
import './RightAd.less'
import adConfig from '@src/constants/ad'
import { useMobileView } from '@src/utils'

export default () => {
  const [isMobileView] = useMobileView()
  return (
    <>
      {!isMobileView && (
        <a
          href="https://cloud.tencent.com/act/pro/serverless-newuser?from=12792"
          target="_blank"
          className="articles-ad-con"
          onClick={() => MtaH5.clickStat('ad_articles')}
        >
          <img className="articles-ad" src={adConfig.articleList} alt="文章列表页广告位" />
        </a>
      )}
      <div className="right-title">
        <h3>正在进行</h3>
      </div>
      <a className="list-ad" href={adBanner.link}>
        <img className="ad-image" src={adBanner.thumbnail} alt={adBanner.title} />
        <div className="ad-title">{adBanner.title}</div>
        <div className="ad-text">{adBanner.text}</div>
      </a>
    </>
  )
}
