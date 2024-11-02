<p align="center">
  <img width="128px" src=".github/logo.png" />
</p>
<h1 align="center">林语</h1>
<p align="center">该代码仓库为 林语 客户端相关代码</p>
<p align="center">后端地址：https://github.com/DWHengr/linyu-server</p>
<p align="center">管理端地址：https://github.com/DWHengr/linyu-admin-web</p>

# 简绍

`林语`是基于`tauri`开发的桌面聊天软件，前端框架使用`react`，后端框架使用`springboot`进行开发
，管理端使用`vue3`进行开发。其中使用http和websocket实现消息发送和推送，使用webrtc实现音视频聊天。

# 目前功能

## 客户端功能

好友相关、朋友圈、音视频聊天、语音消息、文本消息、文件消息、图片消息、截图、群聊等。

## 管理端功能

登录信息统计、用户管理、在线聊天、系统通知管理、第三方会话管理等。

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

# 客户端截图

## 登录

![1](https://github.com/user-attachments/assets/0cccc2d1-79c8-43fd-844f-9254edbe6e7e)

## 聊天

![2](https://github.com/user-attachments/assets/0d3d85be-1342-4bd2-b4f1-614c93a8a0a5)

## 群聊

![3](https://github.com/user-attachments/assets/6aa0a021-92b7-46fe-8aea-5487d97362a7)

## 通讯列表

![4](https://github.com/user-attachments/assets/b1f4ff7b-8ecc-4baa-b38d-bbf7099dec19)

## 朋友圈

![5](https://github.com/user-attachments/assets/b30432b9-904a-432c-bb85-03f8560ddc3b)

## 通知

![6](https://github.com/user-attachments/assets/b7eb922d-9aec-4607-b004-6921e178facb)

## 系统设置

![7](https://github.com/user-attachments/assets/714144de-92bc-42f4-89bb-2a2696884693)

## 其他

![8](https://github.com/user-attachments/assets/43555b11-0a8b-4850-b6fa-0d4d099bc34a)

# 管理端截图

## 登录

![9](https://github.com/user-attachments/assets/2fead35c-1176-4031-8c5d-d94d42af7bdb)

## 首页

![10](https://github.com/user-attachments/assets/cbca1555-53a0-4107-90ea-25e7f9f441e4)

## 在线聊天

![11](https://github.com/user-attachments/assets/acb99729-48d4-47cf-b837-9fcac7221c5d)

## 用户管理

![12](https://github.com/user-attachments/assets/afa3b6de-54f9-4927-9fd5-f5e97dcb8884)

## 系统通知管理

![13](https://github.com/user-attachments/assets/fff0cb8e-0339-4df7-9935-bc552b788e9e)

## 第三方会话管理

![14](https://github.com/user-attachments/assets/38de0173-b2d0-4afb-bba0-dab06aaad920)

# 结语

![admire](https://github.com/user-attachments/assets/7e77ac87-a913-4f87-8783-a1d313297a05)
