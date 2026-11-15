# 🚪 BOYNEXTDOOR 歷年專輯展示網站 (Discography Archive)

這是一個專門為韓國男團 **BOYNEXTDOOR (보이넥스트도어)** 打造的歷年發行作品展示專案。具備輕快少年感、門扉叩響動畫、CD 旋轉動態、歷年曲目清單、詞曲創作貢獻標註以及官方 MV 欣賞功能。

---

## ✨ 網站亮點

1. **🚪 敲門開門互動 (Knock Knock Effect)**：進入網站時的敲門互動，呼應團體「叩響心扉」的 Door 象徵概念。
2. **💿 歷年完整作品庫（嚴格依發行時間排列）**：
   - 📅 **2023-05-30** 《WHO!》（1st Single Album / 三首全主打青澀告白）
   - 📅 **2023-09-04** 《WHY..》（1st EP / 初戀離別篇）
   - 📅 **2023-11-07** 《Fadeaway》（漫畫《Garbage Time》熱血 OST 單曲）
   - 📅 **2024-04-15** 《HOW?》（2nd EP / 初戀三部曲完結篇）
   - 📅 **2024-06-29** 《Miss Night and Day, Pt. 3》（JTBC 電視劇《她的日與夜》OST）
   - 📅 **2024-07-10** 《AND,》（Japan 1st Single / 日本正式出道單曲）
   - 📅 **2024-09-09** 《19.99》（3rd EP / 二十歲門檻前的成長絮語）
   - 📅 **2025-03-14** 《Never Loved This Way Before》（網漫《少女的世界》合作 OST）
   - 📅 **2025-05-13** 《No Genre》（4th EP / 不設限的潮流音樂實驗）
   - 📅 **2025-08-18** 《BOYLIFE》（Japan 2nd Single / 日本第二張青春單曲）
   - 📅 **2025-10-01** 《EXchange4, Pt. 1》（熱門戀綜《換乘戀愛4》官方 OST）
   - 📅 **2025-10-20** 《The Action》（5th EP / 電影般的大銀幕冒險敘事）
   - 📅 **2025-11-10** 《SAY CHEESE!》（Special Single / 拍立得定格笑顏特別曲）
   - 📅 **2026-06-08** 《HOME》（1st Full Album / 回歸初心的首張正規一輯）
   - 📅 **2026-09-28** 《HOME: DELUXE》（Full Deluxe Album / 正規一輯豪華旗艦改版）
3. **📅 支援雙向時間排序**：提供「時間正序（2023 → 2026）」與「最新發行優先（2026 → 2023）」一鍵切換。
4. **🎨 實體封面完整支援**：已完美整合 `ASS/` 資料夾中的所有專輯官方封面圖。
5. **🎵 曲目清單與中韓對照**：完整收錄曲目，並支援主打歌標籤與 YouTube 官方 MV 內嵌播放。
6. **👥 成員檔案室**：收錄 SUNGHO、RIWOO、JAEHYUN、TAESAN、LEEHAN、WOONHAK 六位成員的檔案、代表 Emoji、代表色與座右銘。
7. **⚡ 零依賴即開即用 (Zero Dependencies)**：無需繁瑣安裝任何套件，本機雙擊 `index.html` 即可立即瀏覽！

---

## 🚀 如何快速啟動

### 方法一：直接點擊開啟（最簡單）
直接在檔案總管中對 [index.html](file:///c:/Users/user/Downloads/boynextdoor/index.html) 按兩下，使用任何瀏覽器（Chrome、Edge、Safari、Firefox）即可開啟！

### 方法二：透過 VS Code Live Server
如果你使用 Visual Studio Code，右鍵點擊 `index.html` 並選擇 **「Open with Live Server」**。

---

## 📁 專案目錄結構

```text
boynextdoor/
├── AGENTS.md                  # 給 AI 助手 / 維護者的全方位專案開發規範手冊
├── README.md                  # 本說明文件
├── index.html                 # 網站主頁面
├── ASS/                       # 使用者提供的原始封面圖片目錄
├── TXET/                      # 使用者提供的原始曲目文字資料 (1.txt)
├── css/
│   ├── style.css              # 主樣式表（美漫手繪風、門扉色彩系統、CD動效）
│   └── responsive.css         # 手機與平板適配樣式
├── js/
│   ├── app.js                 # 核心控制邏輯（時間排序、過濾、搜尋、彈窗 Modal 控制）
│   ├── data.js                # 專輯與成員資料庫（支援離線免 CORS 載入）
│   └── door-anim.js           # 叩門轉場特效控制器
├── data/
│   ├── albums.json            # 歷年專輯與曲目結構化 JSON
│   └── members.json           # 成員資料庫 JSON
└── assets/
    ├── covers/                # 高解析專輯封面 (已同步 ASS 圖片與 SVG 備援)
    ├── members/               # 成員形象照目錄
    └── icons/                 # 網站專用圖示目錄
```
