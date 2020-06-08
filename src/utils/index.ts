/**
 * 2019-10-14T00:00:00.000Z -> AUG 07 2019
 * @param {
 * } dateString
 */
export function formateDate(dateString, zero: boolean = false, delimiter: string = '-') {
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
  const promoteEle = document.getElementById('scf-deploy-iframe-or-md')
  if (!promoteEle) return

  let promoteType = localStorage.getItem('promoteType')
  if (!promoteType) {
    promoteType = Math.floor(Math.random() * 3).toString()
    localStorage.setItem('promoteType', promoteType)
  }
  if (isMobile()) {
    showPromoteCLI(promoteEle)
    return
  }
  if (promoteType === '0') {
    showPromoteCLI(promoteEle)
  } else if (promoteType === '1') {
    showPromoteQrCode(promoteEle)
  } else {
    showPromoteQuickButton(promoteEle)
  }
}

function showPromoteCLI(promoteEle: HTMLElement) {
  promoteEle.innerHTML = `
<p><span class="bold-text">Serverless 极速部署，只需三步</span></p>
<p>Serverless Framework 是构建和运维 Serverless 应用的框架。简单三步，即可通过 Serverless Framework 快速实现服务部署。</p>
<p><span class="bold-text">1. 安装 Serverless</stspan/p>
<p>macOS/Linux 系统：推荐使用二进制安装</p>
<div class="gatsby-highlight" data-language="text"><pre class="language-text"><code class="language-text">$ curl -o- -L https://slss.io/install | bash</code></pre></div>
<p>Windows 系统：可通过 npm 安装</p>
<div class="gatsby-highlight" data-language="text"><pre class="language-text"><code class="language-text">$ npm install -g serverless</code></pre></div>
<p><span class="bold-text">2. 创建云上应用</span></p>
<p>在空文件夹下输入 serverless 命令</p>
<div class="gatsby-highlight" data-language="text"><pre class="language-text"><code class="language-text">$ serverless</code></pre></div>
<p>访问命令行中输出的链接，即可访问成功部署后的应用。</p>
<p><span class="bold-text">3. 查看部署信息</span></p>
<p>进入到部署成功的文件夹，运行如下命令，查看部署状态和资源信息：</p>
<div class="gatsby-highlight" data-language="text"><pre class="language-text"><code class="language-text">$ sls info</code></pre></div>
`
}

function showPromoteQuickButton(promoteEle: HTMLElement) {
  const hrElements = promoteEle.parentElement!.querySelectorAll('hr')
  const extraHr = Array.from(hrElements).reverse()[1]
  if (extraHr) {
    promoteEle.parentElement!.removeChild(extraHr)
  }
  const quickStartButton = document.createElement('div')
  quickStartButton.classList.add('quick-start-container')
  quickStartButton.innerHTML =
    '<a href="https://serverless.cloud.tencent.com/deploy/express" target="_blank"><button class="promote-quick-start-button">快速开始</button></a>'
  quickStartButton.onclick = function() {
    MtaH5.clickStat('start_article')
  }
  promoteEle.parentElement!.appendChild(quickStartButton)
}

function showPromoteQrCode(promoteEle: HTMLElement) {
  promoteEle.innerHTML = `<p>
Serverless Framework「一键部署」功能的推出，让部署一个完整的 Serverless 应用变得特别简单，复制以下链接至浏览器访问，可以体验下或许是史上最快的
<a href="https://serverless.cloud.tencent.com/deploy/express">Serverless  HTTP</a>
实战开发！</p>
<blockquote><p><a href="https://china.serverless.com/express">china.serverless.com/express</a></p></blockquote>
<p>当然，你也可以在本页进行扫码部署，效果也是一样的！</p>
<iframe height="500px" width="100%" src="https://serverless.cloud.tencent.com/deploy/express" frameborder="0"  allowfullscreen></iframe>`
}

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase()
  return (
    userAgent.indexOf('android') > -1 ||
    userAgent.indexOf('iphone') > -1 ||
    userAgent.indexOf('iPhone') > -1 ||
    userAgent.indexOf('ipod') > -1 ||
    userAgent.indexOf('ipad') > -1 ||
    userAgent.indexOf('ios') > -1
  )
}
