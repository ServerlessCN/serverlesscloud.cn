// 判断URL来源
if (window.location.href.indexOf("china.serverless.com") > -1 || window.location.href.indexOf("serverlesscloud.cn") > -1 ) {
  var _mtac = {"performanceMonitor":1,"senseQuery":1,"ignoreParams":"test"};
  (function() {
    var mta = document.createElement("script");
    mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
    mta.setAttribute("name", "MTAH5");
    mta.setAttribute("sid", "500703826");
    mta.setAttribute("cid", "500705176");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(mta, s);
  })();
}

(function() {
  var mta_other = document.createElement("script");
  mta_other.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
  mta_other.setAttribute("name", "MTAH5");
  mta_other.setAttribute("sid", "500710929");
  var s_other = document.getElementsByTagName("script")[1];
  s_other.parentNode.insertBefore(mta_other, s_other);
})();
