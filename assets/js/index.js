function init(data) {
  // 生成菜单dom
  generateDom(data)
  // 加载虚化背景
  initMask()
  // 初始化页面
  initPage()

  if (isMobile()) {
    // 动态生成控制菜单的按钮，并隐藏菜单
    generateButton()
  }
}

function generateDom(baseData) {
  let parentDom = document.querySelector('.func')
  let dom
  baseData.forEach(data => {
    dom = document.createElement('div')
    dom.classList.add('item')
    dom.setAttribute('name', data.url)
    dom.innerHTML = data.name
    parentDom.appendChild(dom)
    dom = undefined
  })
}

function generateButton() {
  // 先隐藏
  let dom = document.querySelector('.func.func-content')
  dom.style.display = 'none'

  let button = document.createElement('button')
  button.className = 'dymc-button'
  button.innerHTML = "🙈"
  button.onclick = () => {
    let dom = document.querySelector('.func.func-content')
    if (dom.style.display === 'none') {
      dom.style.display = 'flex'
      button.innerHTML = "🙉"
    }else {
      dom.style.display = 'none'
      button.innerHTML = "🙈"
    }
  }
  const style = document.createElement('style')
  style.innerHTML = `
.dymc-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 2px;
    padding-right: 5px;
    font-size: 18px;
    cursor: pointer;
}`

  if ((navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1) || (/micromessenger/.test(navigator.userAgent.toLowerCase()))) {
    // 在这里添加适用于Safari的CSS样式
    style.innerHTML = `
.dymc-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 2px;
    padding-right: 15px!important;
    font-size: 18px;
    cursor: pointer;
}`
  }
  document.getElementsByTagName('head').item(0).appendChild(style)
  document.body.appendChild(button)
}

function initPage() {
  // 检查url中是否有scene，没有的话就默认第一个，有的话就用传的
  const searchParams = new URLSearchParams(location.search)
  let scene = searchParams.get('scene_id')

  if (!scene) {
    // 没传参，显示导航页面，默认选中第一个
    document.querySelector('.func').classList.add('func-content')
    changeScene('01')
    document.querySelector('.item').classList.add('selected')
  }else {
    if (parseInt(scene) > 30 || parseInt(scene) < 1) {
      // console.warn('id传输有误')
      changeMask(true)
      customAlert({
        title: '提示',
        content: 'scene_id传输有误，即将定位到第一个场景',
        confirm: '确定',
        cancel: '取消',
        success: () => {
          changeMask(false)
          console.log('已自动跳转')
          // scene = '01'
          location.search = '?scene_id=01'
        },
        fail: () => {
          // 点击了取消
          console.log('已取消自动跳转')
        }
      })
      return
    }

    if (parseInt(scene) < 10) {
      scene = '0' + parseInt(scene)
    }

    changeScene(scene)
    let title = baseData.filter(item => {return item.url === scene})[0].name
    document.title = title + ' - Bruce Kong'
  }

  let items = document.querySelectorAll('.item')
  items.forEach(item => {
    item.onclick = e => {
      // 拿到dom绑定的name，即scene
      let scene = e.target.getAttribute('name')
      let currentSelectedName = getSelectedName()
      if (currentSelectedName && currentSelectedName === scene) {
        // 如果有选中，并且是当前选中的，就不再重复选中
        return
      }
      let title = baseData.filter(item => {return item.url === scene})[0].name
      document.title = title + ' - Bruce Kong'
      // 否则，切换选中
      selectedByName(scene)
    }
  })
}

// 获取选中的name
function getSelectedName() {
  let name = ''
  let items = document.querySelectorAll('.item')
  items.forEach(item => {
    if (item.classList.contains('selected')) {
      name = item.getAttribute('name')
    }
  })
  return name
}

// 根据name选中
function selectedByName(name) {
  let items = document.querySelectorAll('.item')
  items.forEach(item => {
    if (item.getAttribute('name') === name) {
      changeScene(name)
      // 已经选中的就不再处理，所以只有当没有选中才设置选中
      if (!item.classList.contains('selected')) {
        item.classList.add('selected')
      }
    }else {
      item.classList.remove('selected')
    }
  })
}

/**
 * 初始化虚化背景
 */
function initMask() {
  const maskElement = document.createElement('div')
  maskElement.className = 'custom-mask-box'
  maskElement.style.width = '100%'
  maskElement.style.height = '100%'
  maskElement.style.position = 'fixed'
  maskElement.style.top = 0
  maskElement.style.left = 0
  maskElement.style.display = 'none'
  maskElement.style.background = 'gray'
  maskElement.style.opacity = 0.8
  maskElement.style.zIndex = 1
  maskElement.style.filter = 'blur(2px)'
  document.body.appendChild(maskElement)
}

/**
 * 显隐虚化背景
 * @param show 是否显示
 */
function changeMask(show) {
  if (typeof show !== 'boolean') {
    show = false
  }
  const maskElement = document.getElementsByClassName('custom-mask-box')
  if (maskElement) {
    maskElement[0].style.display = show ? 'block' : 'none'
  }
}

/**
 * 是否是手机端
 * @returns {boolean}
 */
function isMobile() {
  //获取到userAgent 使用正则表达式解析 若是移动端返回的flag将不为null，反之为null
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  // 如果不符合上面的正则
  if (flag == null) {
    // 判断是不是ios
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  }
  return true;
}

/**
 *自定义的alert弹窗
 * @param options 弹出参数
 * @param options.title 标题
 * @param options.content 需要显示的提示信息
 * @param options.confirm 确定按钮的文本信息
 * @param options.cancel 取消按钮的文本信息
 * @param options.success 确定回调
 * @param options.fail 取消回调
 */
function customAlert(options) {
  let {title, content, confirm, cancel, success, fail} = options
    const confirmWrap = document.createElement('div')
    confirmWrap.className = 'custom-alert-box'
    const style = document.createElement('style')
    style.innerHTML = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.custom-alert-box {
    z-index: 9999;
}

.postbird-box-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 210000001;
    background-color: rgba(0, 0, 0, 0.2);
    display: block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.postbird-box-container.active {
    display: block;
}

.postbird-box-content {
    width: 400px;
    max-width: 90%;
    min-height: 150px;
    background-color: #fff;
    border: solid 1px #dfdfdf;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* margin-top: -100px; */
}

.postbird-box-header {
    width: 100%;
    padding: 10px 15px;
    position: relative;
    font-size: 1.1em;
    letter-spacing: 2px;
}

.postbird-box-close-btn {
    cursor: pointer;
    font-weight: 700;
    color: #000;
    float: right;
    opacity: 0.5;
    font-size: 1.3em;
    margin-top: -3px;
    display: none;
}

.postbird-box-close-btn:hover {
    opacity: 1;
}

.postbird-box-text {
  width: 100%;
  padding: 0 10%;
  text-align: center;
  line-height: 15px;
  font-size: 14px;
  letter-spacing: 1px;
}

.postbird-box-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    margin: 0;
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    border-top: solid 1px #dfdfdf;
    align-items: flex-end;
}

.postbird-box-footer .btn-footer {
    line-height: 44px;
    border: 0;
    cursor: pointer;
    background-color: #fff;
    color: #0e90d2;
    font-size: 1.1em;
    letter-spacing: 2px;
    transition: background-color .5s;
    -webkit-transition: background-color .5s;
    -o-transition: background-color .5s;
    -moz-transition: background-color .5s;
    outline: 0;
}

.postbird-box-footer .btn-footer:hover {
    background-color: #e5e5e5;
}

.postbird-box-footer .btn-block-footer {
    width: 100%;
}

.postbird-box-footer .btn-left-footer,
.postbird-box-footer .btn-right-footer {
    position: relative;
    width: 100%;
}

.postbird-box-footer .btn-left-footer::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background-color: #e5e5e5;
    height: 100%;
    width: 1px;
}

.postbird-box-footer .btn-footer-cancel {
    color: #333333;
}

.postbird-prompt-input {
    width: 100%;
    font-size: 16px;
    border: 1px solid #cccccc;
    outline: none;
    padding:5px 10px 5px 10px;
}`
    confirmWrap.innerHTML = `
        <div class="postbird-box-container active">
            <div class="postbird-box-container">
                <div class="postbird-box-dialog">
                    <div class="postbird-box-content">
                        <div class="postbird-box-header">
                        <span class="postbird-box-close-btn">×</span>
                        <span class="postbird-box-title">
                            <span >${title}</span>
                        </span>
                        </div>
                        <div class="postbird-box-text"><span style="color: black;">${content}</span>
                        </div>
                        <div class="postbird-box-footer">
                        <button class="btn-footer btn-left-footer btn-footer-cancel" style="color:#0e90d2;">${cancel}</button>
                        <button class="btn-footer btn-right-footer btn-footer-ok" style="color:#0e90d2;">${confirm}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    document.getElementsByTagName('head').item(0).appendChild(style)
    document.body.appendChild(confirmWrap)

    const okBtn = document.getElementsByClassName('btn-footer-ok')
    okBtn[okBtn.length - 1].focus()
    okBtn[okBtn.length - 1].onclick = function () {
      if (typeof success === 'function') {
        success()
      }
      const box = document.getElementsByClassName('custom-alert-box')

      document.body.removeChild(box[box.length - 1])
    }
    const cancelBtn = document.getElementsByClassName('btn-footer-cancel')
    cancelBtn[cancelBtn.length - 1].onclick = function () {
      if (typeof fail === 'function') {
        fail()
      }
      const box = document.getElementsByClassName('custom-alert-box')
      document.body.removeChild(box[box.length - 1])
    }
}
