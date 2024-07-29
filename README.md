<p align="center">
  <img width="128px" src=".github/logo.png" />
</p>
<h1 align="center">林语</h1>
<p align="center">该代码仓库为 林语 客户端相关代码</p>
<p align="center">后端地址：https://github.com/DWHengr/linyu-server</p>

# 简绍

`林语`是基于`tauri`开发的桌面聊天软件，前端框架使用`react`，后端框架使用`springboot`进行开发
。其中使用http和websocket实现消息发送和推送，使用webrtc实现音视频聊天。

# 目前功能

好友相关、朋友圈、音视频聊天、语音消息、文本消息、文件消息、图片消息、截图、等。

# 项目相关

## node环境安装

开发使用的node版本为`v20.12.2`，npm版本为`10.5.0`。多个node可以使用`nvm`来进行管理。

## tauri环境安装

tauri需要安装rust等相关环境，tauri安装引导地址：`https://v1.tauri.app/v1/guides/getting-started/prerequisites` 。

## 项目运行

进入项目目录，使用该命令: `npm run tauri dev` 来运行项目。如果发现相关依赖下载慢，npm和rust都可以`配置国内下载源`。

## 项目打包

进入项目目录，使用该命令: `npm run tauri build` 来打包项目。列：在window上打包，会生成一个`.msi`
文件，对应在`linyu-client\src-tauri\target\release\bundle\msi`目录下。

# 项目截图

## 登录

![1](https://github.com/user-attachments/assets/0014be78-8270-4c2e-b3c0-df5318a8e454)

## 聊天

![2](https://github.com/user-attachments/assets/03115e1b-1090-4b73-a6d2-39abdf9cb03c)

## 好友

![3](https://github.com/user-attachments/assets/a4d475ce-a0e8-47d8-a07d-a3e038eb99c3)

## 朋友圈

![4](https://github.com/user-attachments/assets/981d7fad-897e-4973-b51f-31a8106d71cb)

## 通知

![5](https://github.com/user-attachments/assets/b29b4e27-a69a-44d5-a9cf-fe8c1eca69f3)

## 系统设置

![6](https://github.com/user-attachments/assets/aa132533-9b0c-4710-b646-e2a911b7eb25)

# 结语
![admire](https://github.com/user-attachments/assets/7e77ac87-a913-4f87-8783-a1d313297a05)
