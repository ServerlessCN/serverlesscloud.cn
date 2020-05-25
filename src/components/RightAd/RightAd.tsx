import * as React from 'react'
import { adBanner } from '@src/constants/ad_banner'
import './RightAd.less'

export default () => {
  return (
    <>
      <div className="right-title">
        <h3>正在进行</h3>
      </div>
      <div className="list-ad">
        <a className="ad-image" href={adBanner.link}>
          <img src={adBanner.thumbnail} />
        </a>
        <div className="ad-title">{adBanner.title}</div>
        <div className="ad-text">{adBanner.text}</div>
      </div>
    </>
  )
}
