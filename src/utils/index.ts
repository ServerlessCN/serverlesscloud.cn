/**
 * 2019-10-14T00:00:00.000Z -> AUG 07 2019
 * @param {
 * } dateString
 */
export function formateDate(
  dateString,
  zero: boolean = false,
  delimiter: string = '-'
) {
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    let month: any = date.getMonth() + 1
    let day: any = date.getDate()
    if (zero) {
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
    }
    return `${year}${delimiter}${month}${delimiter}${day}`
  } catch (err) {
    return dateString
  }
}

export function debounce(func, wait = 50) {
  let timer = 0
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export function fitPromote() {
  var userAgent = navigator.userAgent.toLowerCase()
  const promoteEle = document.getElementById('scf-deploy-iframe-or-md')
  if (
    userAgent.indexOf('android') > -1 ||
    userAgent.indexOf('iphone') > -1 ||
    userAgent.indexOf('iPhone') > -1 ||
    userAgent.indexOf('ipod') > -1 ||
    userAgent.indexOf('ipad') > -1 ||
    userAgent.indexOf('ios') > -1
  ) {
    if (promoteEle) {
      promoteEle.innerHTML =
        '<div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div>'
    }
  } else {
    if (promoteEle) {
      promoteEle.innerHTML =
        '<p>扫码写代码，这可能是你从未尝试过的开发体验。不来试试吗？</p><p>3 秒极速部署，立即体验史上最快的 <a href="https://serverless.cloud.tencent.com/deploy/express">Serverless  HTTP</a> 实战开发！</p><iframe height="500px" width="100%" src="https://serverless.cloud.tencent.com/deploy/express" frameborder="0"  allowfullscreen></iframe>'
    }
  }
}
