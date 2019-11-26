import './src/styles/index.css'
import 'prismjs/themes/prism-solarizedlight.css'
import 'github-markdown-css/github-markdown.css'

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`)
  }
}
