// 判断URL来源
if (
  window.location.hostname.indexOf('china.serverless.com') > -1 ||
  window.location.hostname.indexOf('serverlesscloud.cn') > -1
) {
  var _mtac = { performanceMonitor: 1, senseQuery: 1, ignoreParams: 'test' }
  ;(function() {
    var mta = document.createElement('script')
    mta.src = '//pingjs.qq.com/h5/stats.js?v2.0.4'
    mta.setAttribute('name', 'MTAH5')
    mta.setAttribute('sid', '500703826')
    mta.setAttribute('cid', '500705176')
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(mta, s)
  })()
}

;(function() {
  var mta_other = document.createElement('script')
  mta_other.src = '//pingjs.qq.com/h5/stats.js?v2.0.4'
  mta_other.setAttribute('name', 'MTAH5')
  mta_other.setAttribute('sid', '500710929')
  var s_other = document.getElementsByTagName('script')[1]
  s_other.parentNode.insertBefore(mta_other, s_other)
})()

// hot map
;(function() {
  var mta_other = document.createElement('script')
  mta_other.src = '//pingjs.qq.com/h5/hotclick.js?v2.0'
  mta_other.setAttribute('name', 'mtah5hotclick')
  mta_other.setAttribute('sid', '500703826')
  mta_other.setAttribute('hid', '5ecf82f0a0306')
  var s_other = document.getElementsByTagName('script')[1]
  s_other.parentNode.insertBefore(mta_other, s_other)
})()

// 百度收录 判断域名
if (
  window.location.hostname.indexOf('china.serverless.com') > -1 ||
  window.location.hostname.indexOf('serverlesscloud.cn') > -1
) {
  ;(function() {
    var bp = document.createElement('script')
    var curProtocol = window.location.protocol.split(':')[0]
    if (curProtocol === 'https') {
      bp.src = 'https://zz.bdstatic.com/linksubmit/push.js'
    } else {
      bp.src = 'http://push.zhanzhang.baidu.com/push.js'
    }
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(bp, s)
  })()
}
