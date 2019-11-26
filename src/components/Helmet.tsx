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

  const { location = {}, description, thumbnail, rss, prefetches } = props
  // const uri = `https://serverless.com${location.pathname}`
  const metaTitle = props.metaTitle || props.title

  meta = [
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: metaTitle },
    // { property: 'og:url', content: uri },
    { property: 'og:description', content: description },
    // {
    //   property: 'og:image',
    //   content: `${process.env.GATSBY_S3_BUCKET}logos/Serverless_mark_black_400x400_v3%402x.jpg`,
    // },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: metaTitle },
    // { name: 'twitter:creator', content: `@${process.env.GATSBY_TWITTER}` },
    { name: 'twitter:description', content: description },
    { name: 'description', content: description },
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

  return <Helmet title={metaTitle} meta={meta} link={link} />
}
