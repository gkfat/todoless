# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## Added

client

- 新增了路由配置
- 新增了多語系
- 新增了註冊/登入頁面
- 新增了帳號管理頁面
- 新增了主控版頁面
  - 新增了卡片: 所有分類
  - 新增了卡片: 最近新增
  - 新增了卡片: 精選
  - 新增了卡片: 最近完成
- 新增共用元件
  - 色彩選擇器

server

- Auth 相關
  - API 註冊
  - API 發送驗證碼
  - API 驗證碼認證
  - API 登入
- 帳號相關
  - API 取得帳號列表
  - API 取得自己帳號
  - API 建立帳號
  - API 啟/停用帳號
  - API 更新帳號權限
  - API 更新帳號資料
  - API 刪除帳號
- 權限相關
  - API 取得權限列表
- 類別相關
  - API 取得類別
  - API 建立類別
  - API 更新類別
  - API 排序類別
  - API 移除類別
- Todo 相關
  - API 取得 Todo
  - API 建立 Todo
  - API 更新 Todo
  - API 完成/未完成 Todo