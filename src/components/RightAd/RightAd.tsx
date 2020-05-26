import * as React from 'react'
import { adBanner } from '@src/constants/ad_banner'
import './RightAd.less'

export default () => {
  return (
    <>
      <div className="right-title">
        <h3>正在进行</h3>
      </div>
      <a className="list-ad" href={adBanner.link}>
        <img className="ad-image" src={adBanner.thumbnail} />
        <div className="ad-title">{adBanner.title}</div>
        <div className="ad-text">{adBanner.text}</div>
      </a>
    </>
  )
}
