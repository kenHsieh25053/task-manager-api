# task-manager-api

## 一個可以讓使用者註冊後新增、修改與刪除代辦事項的API

## Domain url
https://ken-task-manager.herokuapp.com

## API
-------------------
|    HTTP Methods | Endpoint                   | Describtion            |
| ----------------| ---------------------------|------------------------
| GET             | /users/me                  | 取得該用戶資訊(需登入)
| GET             | /users/me/avatar           | 取得該用戶上傳圖像(需登入)
| GET             | /tasks                     | 取得該用戶創建所有待辦事項(需登入)
| GET             | /tasks/:id                 | 取得該用戶創建某代辦事項(需登入)
| GET             | /tasks?sortBy=createAt:desc| 取得該用戶創建所有待辦事項依建立時間排序(降冪。需登入)
| GET             | /tasks?sortBy=createAt:asc | 取得該用戶創建所有待辦事項依建立時間排序(升冪。需登入)
| POST            | /users                     | 創建使用者
| POST            | /tasks                     | 創建代辦事項(需登入)
| POST            | /users/login               | 使用者登入
| POST            | /users/logout              | 使用者登出
| POST            | /users/me/avatar           | 使用者上傳頭像
| PATCH           | /users/me                  | 使用者修改用戶資訊
| PATCH           | /task/:id                  | 使用者修改代辦事項
| DELETE          | /users/me                  | 使用者刪除用戶資訊
| DELETE          | /tasks/:id                 | 使用者刪除代辦事項
| DELETE          | /users/me/avatar           | 使用者刪除上傳圖像

## 操作流程 (使用postman操作)
1. 創立使用者
2. 登入
* 建立待辦事項
* 讀取待辦事項
* 讀取使用者膽案
* 上傳使用者圖像
* 刪除上傳圖像
* 新增任務
* 修改任務
* 修改使用者檔案
* 刪除待辦事項
* 刪除使用者檔案

## 技術
* nodejs 後端javascript 執行環境
* express web框架
* mogooese 操作mongodb
* jsonwebtoken 用來驗證使用者
* bcryptjs 加密密碼
* validator 驗證email格式
* multer 處理圖片

* nodemon 不用一直重啟node, 開發時使用
* env-cmd 設定好開發與測試環境指令
* jest 測試工具
* supertest 模擬客戶端請求測試工具

* 部署在Heroku
