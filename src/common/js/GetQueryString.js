// 获取url参数
var GetQueryString = function (name) {
  var url = window.location.href
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  if ((url.indexOf('?') !== -1)) {
    var index = url.indexOf('?')
    var path = url.substr(index + 1)
    var r = path.match(reg)
    if (r !== null) return unescape(r[2])
    return null
  }
  return null
}
export default GetQueryString
