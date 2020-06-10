import * as React from 'react'
import Helmet from 'react-helmet'

export default function(props: any) {
  let meta: { [key: string]: any }[] = []
  let link: Partial<{
    rel: string
    type: string
    href: string
    title: string
  }>[] = []

  const { location = {}, description, thumbnail, rss, prefetches, keywords } = props
  const hostname = 'https://serverlesscloud.cn'
  const uri = `${hostname}${location.pathname}`
  const metaTitle = props.metaTitle || props.title

  meta = [
    { property: 'og:title', content: metaTitle },
    { property: 'og:url', content: uri },
    { property: 'og:description', content: description },
    {
      property: 'og:image',
      content: `${hostname}/static/logo-serverless-framework-center-vertical-dark-9f937d4f4d10220c3e46afe2a9a2ed3a.png`,
    },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
  ]

  if (thumbnail) {
    meta.push({ property: 'og:image', content: thumbnail })
  }

  if (rss) {
    link.push({
      rel: 'alternate',
      type: 'application/rss+xml',
      href: rss,
      title: metaTitle,
    })
  }

  if (prefetches && prefetches instanceof Array) {
    prefetches.forEach(prefetchLink => {
      link.push({ rel: 'prefetch', href: prefetchLink })
    })
  }

  if (location.pathname) {
    link.push({
      rel: 'canonical',
      href: `https://serverlesscloud.cn${location.pathname}`,
    })
  }

  return <Helmet title={metaTitle} meta={meta} link={link} />
}
