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

## 免责声明

### 1. 基本声明

本软件作为开源项目提供，在法律允许的最大范围内，开发者不对软件的功能性、安全性或适用性作出任何形式的保证，无论是明示的还是暗示的。

### 2. 使用风险声明

2.1 本软件按"现状"提供，使用者需自行承担使用本软件的全部风险。  
2.2 开发者不对软件的运行可靠性、适用性或与特定需求的兼容性提供任何保证。  
2.3 使用者应在充分评估风险的基础上决定是否使用本软件。

### 3. 责任限制与豁免

在任何情况下，开发者及其关联方均不对因使用或无法使用本软件而导致的任何损失或损害承担责任，包括但不限于：

- 数据丢失或泄露
- 利润损失
- 系统中断
- 商业机会损失
- 其他直接、间接或衍生性损失

### 4. 用户义务与责任

4.1 使用者应确保其对本软件的使用符合所有适用的法律法规要求。  
4.2 对本软件进行修改、分发或二次开发的使用者，需自行承担由此产生的全部责任，包括但不限于：

- 法律风险
- 知识产权风险
- 安全风险
- 数据保护责任

### 5. 开发者权利

5.1 开发者保留对本软件进行更新、修改、调整或停止维护的权利。  
5.2 开发者可能在不事先通知的情况下修改本软件或相关服务。  
5.3 开发者保留对本免责声明进行修改的权利。

### 6. 开源贡献

6.1 本软件欢迎社区贡献，但贡献者需遵守相关开源协议。  
6.2 开发者不对第三方贡献的代码质量和安全性负责。

### 7. 其他条款

7.1 本免责声明的任何部分被认定为无效或不可执行时，其余部分仍然有效。  
7.2 本免责声明的最终解释权归开发者所有。

# 结语

![admire](https://github.com/user-attachments/assets/7e77ac87-a913-4f87-8783-a1d313297a05)
