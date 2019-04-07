# task-manager-api

##一個可以讓使用者註冊後新增代辦事項的API##

##Domain url##
https://ken-task-manager.herokuapp.com

##API##
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

