var _mtac = { senseQuery: 1 };
(function() {
  var mta = document.createElement('script')
  mta.src = '//pingjs.qq.com/h5/stats.js?v2.0.4'
  mta.setAttribute('name', 'MTAH5')
  mta.setAttribute('sid', '500703826')
  mta.setAttribute('cid', '500705176')
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(mta, s)
})();
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'https://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
