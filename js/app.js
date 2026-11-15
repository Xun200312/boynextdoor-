/**
 * BOYNEXTDOOR 歷年專輯網站主應用程式邏輯
 * 嚴格依照發行時間排序，全面支援 YouTube 官方 Releases 與曲目播放
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. 初始化資料載入
  const { albums, members } = await window.BND_DATA.loadData();

  // 2. DOM 元素快取
  const albumsGrid = document.getElementById('albumsGrid');
  const membersGrid = document.getElementById('membersGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortAscBtn = document.getElementById('sortAscBtn');
  const sortDescBtn = document.getElementById('sortDescBtn');
  const searchInput = document.getElementById('searchInput');
  const albumModal = document.getElementById('albumModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBody = document.getElementById('modalBody');
  const videoModal = document.getElementById('videoModal');
  const closeVideoBtn = document.getElementById('closeVideoBtn');
  const videoFrame = document.getElementById('videoFrame');
  const directYoutubeLink = document.getElementById('directYoutubeLink');
  const totalAlbumsCount = document.getElementById('totalAlbumsCount');
  const albumCountBadge = document.getElementById('albumCountBadge');

  if (totalAlbumsCount) {
    totalAlbumsCount.textContent = albums.length;
  }

  let currentFilter = 'all';
  let sortDirection = 'asc'; // 'asc': 2023 -> 2026 由遠到近; 'desc': 2026 -> 2023 最新優先
  let searchQuery = '';

  // 官方 Releases 網址
  const OFFICIAL_RELEASES_URL = 'https://www.youtube.com/@boynextdoor_official/releases';

  // 3. 渲染專輯列表 (嚴格依照發行時間排列，移除黑色圓圈跑動)
  function renderAlbums() {
    if (!albumsGrid) return;

    let filtered = albums.filter(album => {
      let matchFilter = true;
      if (currentFilter === 'full') {
        matchFilter = album.type === 'Full Album';
      } else if (currentFilter === 'mini') {
        matchFilter = album.type === 'Mini Album';
      } else if (currentFilter === 'single') {
        matchFilter = album.type === 'Single';
      } else if (currentFilter === 'japan') {
        matchFilter = album.type === 'Japan Single';
      } else if (currentFilter === 'ost') {
        matchFilter = album.type === 'OST';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        album.title.toLowerCase().includes(q) ||
        album.shortTitle.toLowerCase().includes(q) ||
        album.releaseDate.includes(q) ||
        album.tracks.some(t => 
          t.title.toLowerCase().includes(q) || 
          (t.koreanTitle && t.koreanTitle.toLowerCase().includes(q))
        );

      return matchFilter && matchSearch;
    });

    // 依據發行時間排序 (releaseDate: "YYYY-MM-DD")
    filtered.sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (albumCountBadge) {
      const sortText = sortDirection === 'asc' ? '時間正序 (2023 → 2026)' : '最新發行 (2026 → 2023)';
      albumCountBadge.textContent = `顯示 ${filtered.length} / ${albums.length} 張作品 · ${sortText}`;
    }

    if (filtered.length === 0) {
      albumsGrid.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🚪</span>
          <h3>找不到符合的專輯或歌曲</h3>
          <p>請嘗試其他搜尋關鍵字或分類標籤！</p>
        </div>
      `;
      return;
    }

    albumsGrid.innerHTML = filtered.map(album => {
      const titleTracks = album.tracks.filter(t => t.isTitle);
      const titleTrackNames = titleTracks.map(t => t.title).join(' / ') || album.tracks[0]?.title || '';

      return `
        <article class="album-card" data-id="${album.id}" style="--accent-color: ${album.themeColor}">
          <div class="card-badge">${album.badge || album.type}</div>
          <div class="card-cover-wrapper">
            <img src="${album.coverImage}" alt="${album.title}" class="album-cover" loading="lazy" onerror="if (this.src !== '${album.fallbackImage}') { this.src = '${album.fallbackImage}'; }">
          </div>
          <div class="card-content">
            <span class="card-date">📅 ${album.releaseDate} · ${album.era}</span>
            <h3 class="card-title">${album.title}</h3>
            <div class="card-title-track">
              <span class="sparkle">✨</span>
              <strong>代表曲：</strong> ${titleTrackNames}
            </div>
            <p class="card-desc">${album.conceptDescription.substring(0, 72)}...</p>
            <div class="card-footer">
              <span class="track-count">🎵 共 ${album.tracks.length} 首曲目</span>
              <button class="view-btn" data-id="${album.id}">
                探索詳情 <span>→</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // 綁定點擊事件
    document.querySelectorAll('.album-card, .view-btn').forEach(elem => {
      elem.addEventListener('click', (e) => {
        const id = elem.dataset.id || elem.closest('.album-card')?.dataset.id;
        const targetAlbum = albums.find(a => a.id === id);
        if (targetAlbum) {
          openAlbumModal(targetAlbum);
        }
      });
    });
  }

  // 4. 打開專輯詳細 Modal (支援直達 YouTube 與官方 Releases)
  function openAlbumModal(album) {
    if (!albumModal || !modalBody) return;

    const tracksHtml = album.tracks.map(track => {
      const isTitleBadge = track.isTitle ? `<span class="tag-title">主打歌 Title</span>` : '';
      const isPreBadge = track.isPreRelease ? `<span class="tag-pre">先行曲</span>` : '';
      const koreanSub = track.koreanTitle && track.koreanTitle !== track.title ? `<span class="track-kr">(${track.koreanTitle})</span>` : '';
      
      // 判斷是否為純伴奏曲 (Instrumental / Inst.)
      const isInst = /instrumental|inst\b/i.test(track.title);

      // YouTube 搜尋與直接收聽網址 (優先採用專屬指定 URL)
      const searchTrackUrl = `https://www.youtube.com/results?search_query=BOYNEXTDOOR+${encodeURIComponent(track.title)}`;
      const targetUrl = track.youtubeUrl || (track.youtubeMvId ? `https://www.youtube.com/watch?v=${track.youtubeMvId}` : searchTrackUrl);

      // 純伴奏曲不顯示 MV 觀看按鈕
      const hasMv = !isInst && (track.youtubeMvId || (track.youtubeUrl && track.isTitle));
      const mvBtn = hasMv ? `
        <a href="${targetUrl}" target="_blank" rel="noopener" class="track-action-btn mv-btn" title="在新分頁開啟 YouTube 觀賞官方影片">
          🎬 觀看 ↗
        </a>
      ` : '';

      const listenBtn = `
        <a href="${targetUrl}" target="_blank" rel="noopener" class="track-action-btn listen-btn" title="前往 YouTube 收聽官方音源">
          🎧 收聽 ↗
        </a>
      `;

      return `
        <li class="track-item ${track.isTitle ? 'highlight-track' : ''}">
          <div class="track-num">${String(track.trackNumber).padStart(2, '0')}</div>
          <div class="track-info">
            <div class="track-header">
              <a href="${targetUrl}" target="_blank" rel="noopener" class="track-title-link" title="前往 YouTube 播放此歌曲">
                <h4 class="track-title">${track.title} ${koreanSub}</h4>
              </a>
              ${isTitleBadge}
              ${isPreBadge}
            </div>
            ${track.highlightLyrics ? `<p class="track-quote">「 ${track.highlightLyrics} 」</p>` : ''}
          </div>
          <div class="track-meta">
            <span class="track-duration">${track.duration || ''}</span>
            <div class="track-btns-wrap">
              ${mvBtn}
              ${listenBtn}
            </div>
          </div>
        </li>
      `;
    }).join('');

    modalBody.innerHTML = `
      <!-- 官方 YouTube Releases 直達橫幅 -->
      <a href="${OFFICIAL_RELEASES_URL}" target="_blank" rel="noopener" class="official-releases-banner">
        <div class="banner-left">
          <span class="banner-yt-icon">▶</span>
          <div class="banner-text">
            <strong>前往 YouTube 官方 Releases 專區</strong>
            <p>點此直達 @boynextdoor_official/releases 收聽整張專輯正版音源與全部作品</p>
          </div>
        </div>
        <span class="banner-go-btn">官方 Releases ↗</span>
      </a>

      <div class="modal-album-hero" style="--modal-theme: ${album.themeColor}">
        <div class="modal-cover-side">
          <img src="${album.coverImage}" alt="${album.title}" class="modal-cover" onerror="this.src='${album.fallbackImage}'">
          <div class="modal-badges">
            <span class="pill-badge">${album.type}</span>
            <span class="pill-badge">📅 ${album.releaseDate}</span>
          </div>
        </div>
        <div class="modal-header-side">
          <span class="modal-era-label">${album.era}</span>
          <h2 class="modal-title">${album.title}</h2>
          <div class="concept-box">
            <h4>💡 專輯核心概念</h4>
            <p>${album.conceptDescription}</p>
          </div>
        </div>
      </div>

      <div class="modal-tracks-section">
        <div class="tracks-section-header">
          <h3>💿 收錄曲目 (${album.tracks.length} 首)</h3>
          <span class="tracks-hint">💡 點擊「🎧 收聽 ↗」或「🎬 MV ↗」可直接在 YouTube 開啟播放</span>
        </div>
        <ul class="tracks-list">
          ${tracksHtml}
        </ul>
      </div>
    `;

    albumModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  // 5. MV 視窗控制
  function openVideoModal(mvId, title = 'Official MV') {
    if (!videoModal || !videoFrame) return;
    const directUrl = `https://www.youtube.com/watch?v=${mvId}`;
    videoFrame.src = `https://www.youtube-nocookie.com/embed/${mvId}?autoplay=1`;
    if (directYoutubeLink) {
      directYoutubeLink.href = directUrl;
    }
    videoModal.classList.add('active');
  }

  function closeVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoFrame.src = '';
    videoModal.classList.remove('active');
  }

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // 6. 關閉專輯 Modal
  function closeAlbumModal() {
    if (!albumModal) return;
    albumModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeAlbumModal);
  if (albumModal) {
    albumModal.addEventListener('click', (e) => {
      if (e.target === albumModal) closeAlbumModal();
    });
  }

  // 7. 渲染成員介紹 (RIWOO 為水獺 🦦)
  function renderMembers() {
    if (!membersGrid || !members) return;

    membersGrid.innerHTML = members.map(member => `
      <div class="member-card" style="--mem-color: ${member.signatureColor}">
        <div class="member-avatar">
          <span class="member-emoji">${member.representativeEmoji}</span>
        </div>
        <div class="member-names">
          <h4 class="member-stage">${member.stageName}</h4>
          <span class="member-sub">${member.chineseName} · ${member.koreanName}</span>
        </div>
        <div class="member-roles">
          ${member.positions.map(pos => `<span class="role-pill">${pos}</span>`).join('')}
        </div>
        <p class="member-quote">"${member.quote}"</p>
        <p class="member-desc">${member.description}</p>
      </div>
    `).join('');
  }

  // 8. 排序按鈕監聽
  if (sortAscBtn) {
    sortAscBtn.addEventListener('click', () => {
      sortDirection = 'asc';
      sortAscBtn.classList.add('active');
      sortDescBtn.classList.remove('active');
      renderAlbums();
    });
  }

  if (sortDescBtn) {
    sortDescBtn.addEventListener('click', () => {
      sortDirection = 'desc';
      sortDescBtn.classList.add('active');
      sortAscBtn.classList.remove('active');
      renderAlbums();
    });
  }

  // 9. 篩選與搜尋監聽
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderAlbums();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAlbums();
    });
  }

  // 按 ESC 鍵關閉任何彈出視窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAlbumModal();
      closeVideoModal();
    }
  });

  // 初始渲染
  renderAlbums();
  renderMembers();
});
