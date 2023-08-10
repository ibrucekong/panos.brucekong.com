# 全景图

## 新增全景图

以`山东科技大学`为例，全景图命名为`sdust`

* 新建对应的文件夹`sdust`
* 将全景的资源文件夹`panos`放到`sdust`下
* 将全景的资源文件夹`tour.xml`放到`assets/krp/`，并命名为`sdust.xml`
* 修改`sdust.xml`中的内容，
  * ~~全局替换，将 `panos/` 替换为 `../../inspur/panos/`~~
  * 全局替换，将 `panos/` 替换为 `https://www.zhreleven.com:50001/sdust/`
* 在根目录的`index.html`下的`mounted()`中新增数据，格式以上面的`data()`中的数据格式为标准
