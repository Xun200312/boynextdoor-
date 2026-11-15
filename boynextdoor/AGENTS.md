# BOYNEXTDOOR 歷年專輯網站開發指南 (AGENTS.md)

> **版本**：v1.0.0  
> **適用對象**：參與本專案的 AI 代理人 (AI Agents)、協作開發者與維護者  
> **語言規範**：繁體中文（台灣習慣用語）、程式碼英文命名  

---

## 1. 專案願景與定位 (Project Vision)

本專案旨在打造一個專注於展示韓國男子流行音樂團體 **BOYNEXTDOOR (보이넥스트도어)** 歷年發行專輯、單曲、音樂作品（Discography）與團體概念的互動式官方風專題網站。

### 團體背景概念
* **所屬廠牌**：KOZ Entertainment (HYBE 旗下廠牌，創辦人為 ZICO)
* **出道日期**：2023 年 5 月 30 日
* **官方粉絲名**：**ONEDOOR (원도어)**
* **核心標誌概念**：🚪 **「Door」（門）** —— 象徵叩響大眾的心扉，展現自然、平易近人的鄰家少年日常生活與坦率情感。
* **成員陣容 (6人)**：
  1. **SUNGHO** (成淏 / 朴成淏) - Main Vocalist
  2. **RIWOO** (柳岡 / 李常赫) - Main Dancer, Vocalist
  3. **JAEHYUN** (明宰鉉 / 隊長) - Leader, Producer, Rapper, Vocalist
  4. **TAESAN** (漢太山 / 韓東旼) - Producer, All-rounder, Vocalist, Rapper
  5. **LEEHAN** (李涵 / 金桐儇) - Vocalist
  6. **WOONHAK** (金雲鶴 / 忙內) - Maknae, Producer, Vocalist

---

## 2. 視覺風格與設計語言 (Design System)

所有 AI Agent 在產生、修改 CSS 或視覺組件時，必須嚴格遵守以下品牌調性：

### 核心設計關鍵詞
* **Boyhood & Daily Life**（青春成長、鄰家男孩日常、隨性真實）
* **Playful & Energetic**（活力充沛、俏皮幽默、手繪塗鴉與對話框）
* **Retro Pop & Door Metaphor**（門扉扣鎖、CD 旋轉、卡帶隨身聽、便籤貼紙、拍立得照片質感）

### 色彩規範 (Color Palette)
```css
:root {
  --bnd-blue-primary: #3A86FF;    /* 晴空活力藍 (象徵純真與藍天) */
  --bnd-blue-light: #EBF4FF;      /* 柔和天藍背景底色 */
  --bnd-yellow-accent: #FFBE0B;   /* 門扉標誌暖黃 / 亮黃 */
  --bnd-coral-orange: #FB5607;    /* 熱情珊瑚橘 */
  --bnd-pink-pop: #FF006E;        /* 塗鴉亮粉紅 */
  --bnd-navy-dark: #1E2238;       /* 質感夜空深藍 (主要文字與深色背景) */
  --bnd-bg-cream: #FAF9F6;        /* 溫暖奶油白基底色 */
  --bnd-card-bg: #FFFFFF;         /* 卡片背景純白 */
  --bnd-border-color: #2B2D42;    /* 漫畫手繪風線條黑 */
}
```

### 互動與動效規範
* **叩門特效 (Knock the Door)**：首頁包含敲門/開門動畫，打開門扉進入音樂世界。
* **黑膠/CD 光碟旋轉**：檢視專輯時，唱片從封套中滑出旋轉播放。
* **便條紙與貼紙微角度傾斜**：`transform: rotate(-1.5deg)` 營造手作隨性的高中生筆記本氛圍。

---

## 3. 目錄結構與架構原則 (Directory Structure)

專案目前遵循 **現代原生前端 (Zero-dependency Vanilla Architecture)**，可直接在瀏覽器雙擊或透過靜態伺服器運行，同時具備完整的資料分離設計，便於未來升級至 React / Next.js。

```text
boynextdoor/
├── AGENTS.md                  # [本檔案] AI 代理人專案指示與規範說明
├── README.md                  # 給使用者的快速上手與專案說明
├── index.html                 # 主入口網站 (包含門扉開場、專輯時間軸、Modal詳情等)
├── css/
│   ├── style.css              # 全域與核心樣式 (含主題變數、卡片、門扉動效)
│   └── responsive.css         # 響應式佈局 (Mobile, Tablet, Desktop)
├── js/
│   ├── app.js                 # 核心邏輯 (DOM渲染、過濾器、Modal控制、音訊模擬)
│   ├── data.js                # 專輯資料提供者 (支援本地檔案免 CORS 的直接載入)
│   └── door-anim.js           # 叩門轉場特效控制器
├── data/
│   ├── albums.json            # 歷年專輯與曲目結構化 JSON
│   └── members.json           # 成員資料庫 JSON
└── assets/
    ├── covers/                # 專輯封面圖片 (.webp / .jpg / .png / .svg)
    ├── members/               # 成員形象照
    └── icons/                 # 網站專用圖示 (門、音符、星星、愛心等)
```

---

## 4. 資料模型定義 (Data Schemas)

當 AI Agent 讀取或修改 `data/albums.json` 或 `data/members.json` 時，請依循以下 TypeScript 規格：

### 專輯資料結構 (`Album`)
```typescript
interface Track {
  trackNumber: number;
  title: string;
  koreanTitle?: string;
  duration: string;           // 格式 "MM:SS", 例如 "02:59"
  isTitle: boolean;           // 是否為該專輯的主打歌
  isPreRelease?: boolean;     // 是否為先行曲
  credits: {
    lyrics?: string[];        // 作詞名單 (如 Jaehyun, Taesan, Woonhak, ZICO)
    composition?: string[];   // 作曲名單
    arrangement?: string[];   // 編曲名單
  };
  highlightLyrics?: string;   // 標誌性一句歌詞 (中/韓/英)
  youtubeMvId?: string;       // YouTube MV 影片 ID (例如 "돌아버리겠다")
}

interface Album {
  id: string;                 // 唯一識別代碼, 如 "who", "why", "how", "and-jp", "19-99"
  title: string;              // 專輯全名, 如 "1st Single Album [WHO!]"
  shortTitle: string;         // 簡短名稱, 如 "WHO!"
  releaseDate: string;        // 發行日期, 格式 "YYYY-MM-DD"
  type: "Single" | "Mini Album" | "EP" | "Japan Single" | "OST" | "Special";
  era: string;                // 時代/系列名稱, 如 "First Love Trilogy Part 1"
  conceptDescription: string; // 繁體中文概念解說
  coverImage: string;         // 圖片路徑 (相對路徑)
  themeColor: string;         // 代表色 Hex (如 "#3A86FF")
  spotifyUrl?: string;        // Spotify 外部連結
  appleMusicUrl?: string;     // Apple Music 外部連結
  tracks: Track[];
}
```

### 成員資料結構 (`Member`)
```typescript
interface Member {
  id: string;                 // 如 "jaehyun", "taesan", "sungho"
  stageName: string;          // 藝名 (如 "JAEHYUN")
  koreanName: string;         // 韓文名 (如 "명재현")
  chineseName: string;        // 中文名 (如 "明宰鉉")
  birthDate: string;          // "YYYY-MM-DD"
  positions: string[];        // 擔當職責 (如 ["Leader", "Producer", "Rapper"])
  mbti?: string;
  representativeEmoji: string;// 代表表情符號 (如 🦦 🐶 🐟 🐱 🐺 🦊 🧸)
  signatureColor: string;     // 代表色
  quote: string;              // 成員招牌金句或青春小語
  photo: string;
}
```

---

## 5. AI Agent 任務執行規範 (Agent Workflows & SOP)

### 任務 A：新增一張新專輯 (Adding a New Album)
1. 編輯 `data/albums.json`，於列表最後新增物件，遵循上述 `Album` 介面。
2. 同步更新 `js/data.js` 的內建靜態備份陣列（確保使用者直接雙擊 `file://` 開啟時仍能正常讀取所有新專輯）。
3. 在 `assets/covers/` 新增對應尺寸之封面圖片（建議正方形 800x800），若暫無實體圖，使用內建的 SVG 向量風格封面產生器或 Placeholder。
4. 檢查曲目中是否有成員創作（Jaehyun、Taesan、Woonhak 等在著作權名單上的貢獻），並在 `credits` 中特別註明。

### 任務 B：修改視覺風格或增加新特效
1. 嚴格維持「少年感」、「門扉」、「輕復古潮流」之核心審美。
2. 保持 CSS 變數統一，避免硬編碼 (Hardcode) 顏色。
3. 確保動畫在行動裝置上的效能，使用 `transform` 與 `opacity` 為主的 GPU 加速屬性。

### 任務 C：多語言或曲目歌詞擴充
1. 優先提供**韓文原曲名**與**繁體中文對照說明**。
2. 歌詞金句需經過繁體中文精準潤飾，保留 BOYNEXTDOOR 特有的直率口語感（例如 "뭣 같아" 翻譯為 "糟透了 / 像狗屎一樣" 等生活化反叛感）。

---

## 6. 歷年作品發行脈絡一覽表 (Discography Reference)

AI Agent 在生成內容時可直接參考此權威時間線（依發行時間由遠到近排列）：

| 發行日期 | 專輯類型 | 專輯名稱 | 代表主打歌 | 概念核心 |
| :--- | :--- | :--- | :--- | :--- |
| **2023-05-30** | 1st Single Album | **《WHO!》** | But I Like You / One and Only / Serenade | 初見心動與一見鍾情的「三重主打」青澀告白 |
| **2023-09-04** | 1st EP (Mini) | **《WHY..》** | But Sometimes (뭣 같아) | 初戀之後初次品嚐離別的混亂與青春刺痛 |
| **2023-11-07** | Single | **《Fadeaway》** | Fadeaway | 《Garbage Time》網絡漫畫 OST 單曲，滿腔熱血籃球少年 |
| **2024-04-15** | 2nd EP (Mini) | **《HOW?》** | Earth, Wind & Fire | 「初戀三部曲」最終章，描寫熱戀期的多變心境 |
| **2024-06-29** | Drama OST | **《Miss Night and Day, Pt. 3》** | Lucky Charm | JTBC 電視劇《她的日與夜》OST，元氣滿滿的幸運護身符 |
| **2024-07-10** | Japan 1st Single | **《AND,》** | Earth, Wind & Fire (JP) / GOOD DAY | 日本正式出道，青春物語的跨國界延續 |
| **2024-09-09** | 3rd EP (Mini) | **《19.99》** | Dangerous / Nice Guy | 踏入 20 歲前夕的 19.99 歲，迷惘、叛逆與真誠告白 |
| **2025-03-14** | Special OST | **《Never Loved This Way Before》** | Never Loved This Way Before | 《少女的世界》漫畫聯動 OST，白色情人節溫柔告白 |
| **2025-05-13** | 4th EP (Mini) | **《No Genre》** | I Feel Good | 撕掉風格框架，不被定義的多元音樂實驗 |
| **2025-08-18** | Japan 2nd Single | **《BOYLIFE》** | Count To Love | 日本第二張單曲，溫柔與活力交織的夏日物語 |
| **2025-10-01** | Variety OST | **《EXchange4, Pt. 1》** | Ruin My Life | 《換乘戀愛4》官方 OST，離別與思念交織的感性嗓音 |
| **2025-10-20** | 5th EP (Mini) | **《The Action》** | Hollywood Action | 如電影大銀幕般的動態敘事與幽默冒險野心 |
| **2025-11-10** | Single | **《SAY CHEESE!》** | SAY CHEESE! | 拍立得快門定格的美好笑顏特別單曲 |
| **2026-06-08** | 1st Full Album | **《HOME》** | VIRAL | 首張正規一輯，回歸門扉扣響心門的溫暖歸宿 |
| **2026-09-28** | Full Deluxe Album | **《HOME: DELUXE》** | ANIMAL | 正規一輯豪華旗艦改版，收錄13首青春大作 |

---

## 7. 程式碼品質與 Git 協作要求

* **無破壞性變更**：任何修改不可破壞本機離線直接點擊 `index.html` 即可瀏覽的特性。
* **中文註解規範**：所有函式與組件說明均使用正體中文撰寫 JSDoc / 註解。
* **語義化標籤**：HTML 遵循 `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` 等語義化標籤。
* **無障礙存取 (a11y)**：按鈕均具備 `aria-label`，圖片均具備明確 `alt` 說明。

*本手冊由開發團隊維護，任何結構調整需同步更新本文件。*
