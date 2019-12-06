/* eslint-disable */

'use strict'

require('./styles.css')

exports.onClientEntry = function() {
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

  window.showClipboardToaster = function(toasterId) {
    var textElem = document.querySelector(
      '[data-toaster-id="'.concat(toasterId, '"]')
    )

    if (!textElem) {
      return
    }

    var el = document.createElement('div')
    el.className = textElem.dataset.toasterClass
    el.innerHTML = '\n      <div class="'
      .concat(textElem.dataset.toasterTextClass, '">\n        ')
      .concat(textElem.dataset.toasterText, '\n      </div>\n    ')
      .trim()
    document.body.appendChild(el)
    setTimeout(function() {
      document.body.removeChild(el)
    }, textElem.dataset.toasterDuration)
  }
}
