import './src/styles/index.css'
import './src/styles/custom-code-buttons.css'
import 'prismjs/themes/prism.css'
import 'github-markdown-css/github-markdown.css'

export const onClientEntry = () => {
  // 改写gatsby-remark-code-buttons的copyToClipboard的方法，等待这个插件的作者合并了我的提交就可以去掉了
  window.copyToClipboard = (str, toasterId) => {
    const el = document.createElement('textarea')
    el.className = 'gatsby-code-button-buffer'
    el.innerHTML = str

    document.body.appendChild(el)

    const range = document.createRange()
    range.selectNode(el)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)

    document.execCommand(`copy`)
    document.activeElement.blur()

    setTimeout(() => {
      document.getSelection().removeAllRanges()
      document.body.removeChild(el)
    }, 100)

    if (toasterId) {
      window.showClipboardToaster(toasterId)
    }
  }
}
