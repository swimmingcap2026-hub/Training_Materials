# SCREEN DNS SU-3200 WET — 3D Training System

互動式 3D 教育訓練網頁，主題為 **SU-3200 型單片式 (single-wafer) 半導體濕式清洗機台**。
純靜態網站，白色底、無框架、可直接以 GitHub Pages 發佈。

Interactive 3D courseware for a **single-wafer semiconductor wet-cleaning tool**.
Static site, white theme, no build step, deployable straight to GitHub Pages.

---

## 功能 / Features

| | 中文 | English | 日本語 |
|---|---|---|---|
| 🏭 | 整機 3D 模型（22 個主要單元） | Full-tool 3D model (22 major units) | 装置全体の3Dモデル（22ユニット） |
| 🔬 | 單一腔室細部 3D（19 個零件） | Single-chamber detail (19 components) | 単一チャンバー詳細（19部品） |
| ◍ | 外殼透視（可調透明度） | X-ray enclosure with opacity slider | 筐体スケルトン（透明度可変） |
| ◧ | 剖面圖（X/Y/Z 任意軸、可反向） | Cross section on any axis, flippable | 断面図（X/Y/Z・反転可） |
| ✳ | 爆炸圖（距離可調） | Exploded view with distance slider | 分解図（距離可変） |
| ▶ | 10 步製程流程動畫（轉速、擺臂、供液、甩乾粒子） | 10-step animated recipe (RPM, arms, dispense, throw-off droplets) | 10ステップのプロセス動画 |
| 📖 | 每個零件都有功能、運作原理、關鍵參數、常見異常 | Every part documented: function, principle, parameters, failure modes | 全部品に機能・原理・パラメータ・異常事例 |
| 🌏 | 中 / EN / 日 即時切換 | Live zh-TW / EN / JA switching | 中/英/日の即時切替 |
| ✅ | 8 題學習檢核（附解析） | 8-question knowledge check with explanations | 解説付き理解度チェック8問 |

## 使用方式 / Usage

直接開啟 `index.html` 即可（無需建置、無需網路，three.js 已內含於 `assets/vendor/`）。
若要在本機以伺服器方式檢視：

```bash
python3 -m http.server 8000
# 瀏覽 http://localhost:8000
```

### 操作 / Controls

- 滑鼠左鍵拖曳：旋轉；滾輪：縮放；右鍵拖曳：平移
- 點擊 3D 模型上的任一零件，或左側清單項目 → 右側顯示該零件說明
- 「單獨顯示」可隱藏其他零件，只保留選取的元件
- 「腔室細部」分頁可播放完整製程流程，或用步驟按鈕逐步檢視

## 發佈到 GitHub Pages / Publishing

倉庫內含 `.github/workflows/pages.yml`。在 GitHub 上：

1. **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**
2. 推送本分支後，workflow 會自動部署，網址為
   `https://<owner>.github.io/<repo>/`

（若偏好不使用 Actions，也可在 Pages 設定中直接選 **Deploy from a branch**，
分支選本分支、資料夾選 `/ (root)`。）

## 目錄結構 / Structure

```
index.html                     頁面骨架與四個分頁
assets/css/style.css           樣式（白底主題、響應式）
assets/js/i18n.js              介面三語字串表
assets/js/parts-data.js        零件知識庫（22 + 19 個零件 × 3 語）、10 步製程配方
assets/js/quiz-data.js         學習檢核題庫
assets/js/three-helpers.js     幾何建模輔助函式
assets/js/model-tool.js        整機 3D 模型
assets/js/model-chamber.js     腔室 3D 模型（含可動件與液流特效）
assets/js/viewer.js            共用檢視器：打光、選取、爆炸、剖切、透視、標籤
assets/js/app.js               UI 控制、語言切換、製程動畫驅動
assets/vendor/                 three.js r160（已內含，離線可用）
```

## 免責聲明 / Disclaimer

本教材為**通用型單片式濕式清洗設備教學模型**，用於原理訓練與教育用途，
**非原廠圖面、規格書或操作手冊**；3D 幾何為示意性重建，尺寸與配置經簡化。
實機操作、維護與安全規定請以設備原廠文件與貴廠 SOP 為準。

This courseware is a **generic instructional model** of a single-wafer wet-cleaning
system for principle training. It is **not** an OEM drawing, specification or operating
manual; the 3D geometry is a simplified, representational reconstruction. For real
operation, maintenance and safety, follow the manufacturer documentation and your fab SOP.

Trademarks referenced belong to their respective owners; this project is not affiliated
with or endorsed by any equipment manufacturer.

## 授權 / License

教材內容與程式碼以 MIT License 釋出，three.js 依其原授權 (MIT)。
