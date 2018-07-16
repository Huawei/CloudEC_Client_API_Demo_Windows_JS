<div align="center">
  <h1>CloudEC JSSDK Usage</h1>
</div>


<h2 align="center">简介</h2>

```bash
这里展示了CloudEC JSSDK的接口调用示例，基于ES5的语法，各个功能按模块对应一个自定义页面组件(HTML Customer Element)。您可以基于各个功能示例代码快速学习相关接口的使用。
```

<h2 align="center">目录结构</h2>

```bash
│ index.html  首页，功能展示区域
├─daemon 后台tup守护进程，提供专业的实时音视频能力; 支持二次打包，参考相关文档.
├─tool JSSDK日志分析工具，使用方法可参考开发指南相关章节
├─sdk  核心库 cloudEC 能力开放 JSSDK  
└─usage  JSSDK接口调用示例，含UI控件
    │  conference_usage.js  接口调用示例入口
    │  event_process.js 接口回调事件监听处理模板
    └─components  UI组件，按功能模块示例相关接口的调用方法
        │  attendee_list.html 与会者列表组件
        │  book_conf.html 预定会议组件
        │  conf_control.html 会议控制组件
        │  conf_list.html 会议信息列表组件
        │  data_canvas.html 数据会议组件
        │  media_device.html 媒体设备组件
        │  video_canvas.html 视频会议组件
        ├─my97datepicker 第三方日期组件
        └─webcomponentsjs-1.0.20 第三方支持自定义页面的组件，兼容多个浏览器
```

<h2 align="center">使用说明</h2>

### `环境准备`

**浏览器**
```bash
IE11+
Chrome60+
Firefox55+
```
**WEB服务器**
```bash
搭建WEB服务器，推荐
Tomcat
Apache
*
```
**CloudEC环境**
```bash
获取对应CloudEC环境的uPortal地址，例如：10.4.33.69:8443
获取对应CloudEC环境的EC账号,例如：uctest110@huawei.com Aa123456
推荐：华为开发者社区远程实验室环境、华为公有云环境
```
### `快速开始`
```bash
步骤1 在WEB服务器中配置JSSDK路径，并重启WEB服务
步骤2  确保tsdk后台服务已经开启
步骤3：通过浏览器访问WEB服务地址，输入EC账号 点击登录按钮，完成用户登录 
步骤4：点击立即会议按钮，创建立即会议
步骤5：结束
```
