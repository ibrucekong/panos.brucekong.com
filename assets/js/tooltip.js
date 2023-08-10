// ===================================================
// Tooltip V1.01
// 为超级连接加上样式的js
// Author:Huacn Lee
// Blog: Huacn.cnblogs.com
// ===================================================
var _BarIdName = '___tooltipbar'
var _BarTitleIdName = '___tooltipbartitle'
var _BarLinkIdName = '___tooltipbarlink'
var isA = false

//页面上调用的方法
function initToolTip(tagaArry) {
  initTipbar()//创建tooltip显示区域
  initStyle()//注册CSS样式

  var tag = null
  //alert(document.getElementsByTagName("head")[0].innerHTML);
  if (!tagaArry) {
    tagaArry = document.getElementsByTagName('a')
    isA = true
  }

  for (var i = 0; i < tagaArry.length; i++) {
    tag = tagaArry[i]
    //alert(tag.href);
    var oldTitle = tag.title

    //为超级连接加入鼠标事件
    //进入连接
    tag.onmouseover = function () {
      showTipbar(this)
    }
    //离开连接
    tag.onmouseout = function () {
      hideTipbar(this)
    }
    //在连接上移动，设置坐标
    tag.onmousemove = function () {
      setTipLocation()
    }

    //为Firefox加入mousemove的事件侦听,因为window.eventFirefox没有办法用
    if (tag.addEventListener) {
      tag.addEventListener('mousemove', setTipLocation, true)
    }
  }

}

//显示tooltip
function showTipbar(tag) {
  var tipbar = $(_BarIdName)
  var tipTitle = $(_BarTitleIdName)
  var tipLink = $(_BarLinkIdName)

  tipTitle.innerHTML = tag.title
  if (isA) {
    tipLink.innerHTML = tag.href
  } else {
    tipLink.innerHTML = tag.getAttribute('content')
  }
  tag.title = ''
  tipbar.style.display = ''
}

//隐藏tooltip
function hideTipbar(tag) {
  var tipbar = $(_BarIdName)
  var tipTitle = $(_BarTitleIdName)
  tipbar.style.display = 'none'
  tag.title = tipTitle.innerHTML

}

//初始化tooltip区域
function initTipbar() {

  var div = document.createElement('div')
  div.className = 'tooltipclass123123'
  div.id = _BarIdName

  var divTitle = document.createElement('p')
  divTitle.id = _BarTitleIdName
  divTitle.className = 'tip'
  div.appendChild(divTitle)

  var divLink = document.createElement('p')
  divLink.id = _BarLinkIdName
  divLink.className = 'url'
  div.appendChild(divLink)

  document.body.appendChild(div)
  div.style.display = 'none'

  //alert(div.innerHTML);
}

//设置tipbar的位置
function setTipLocation(e) {
  var intX = 0, intY = 0
  //判断有没有收到firefox的监听的event
  if (e == null) {
    //当没收到时用window.event IE与Opera支持的
    e = window.event
  }

  if (e.pageX || e.pageY) {
    intX = e.pageX
    intY = e.pageY
  } else if (e.clientX || e.clientY) {
    if (document.documentElement.scrollTop) {
      intX = e.clientX + document.documentElement.scrollLeft
      intY = e.clientY + document.documentElement.scrollTop
    } else {
      intX = e.clientX + document.body.scrollLeft
      intY = e.clientY + document.body.scrollTop
    }
  }

  //取得tooltip对象
  var tipbar = $(_BarIdName)

  tipbar.style.top = (intY + 20) + 'px'
  tipbar.style.left = (intX + 10) + 'px'
}

//注册css
function initStyle() {
  var linkstyle = document.createElement('link')
  linkstyle.setAttribute('href', 'styles/tooltip.css')
  linkstyle.setAttribute('rel', 'stylesheet')
  linkstyle.setAttribute('type', 'text/css')
  linkstyle.setAttribute('media', 'screen')

  document.getElementsByTagName('head')[0].appendChild(linkstyle)
}

function $(re) {
  return document.getElementById(re)
}
