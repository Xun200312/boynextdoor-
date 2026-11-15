/**
 * BOYNEXTDOOR 敲門與門扉轉場動畫控制器
 */

document.addEventListener('DOMContentLoaded', () => {
  const doorOverlay = document.getElementById('doorOverlay');
  const doorPanel = document.getElementById('doorPanel');
  const knockBtn = document.getElementById('knockBtn');
  const skipBtn = document.getElementById('skipDoorBtn');

  if (!doorOverlay || !doorPanel) return;

  let isOpening = false;

  function openTheDoor() {
    if (isOpening) return;
    isOpening = true;

    // 播放敲門音效或震動動畫
    doorPanel.classList.add('knocking');

    setTimeout(() => {
      doorPanel.classList.remove('knocking');
      doorPanel.classList.add('door-open');
      doorOverlay.classList.add('fade-out');

      // 播放歡迎音效提示或通知
      const welcomeToast = document.getElementById('welcomeToast');
      if (welcomeToast) {
        welcomeToast.classList.add('show');
        setTimeout(() => welcomeToast.classList.remove('show'), 3500);
      }

      setTimeout(() => {
        doorOverlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
      }, 900);
    }, 600);
  }

  if (knockBtn) {
    knockBtn.addEventListener('click', openTheDoor);
  }

  if (doorPanel) {
    doorPanel.addEventListener('click', openTheDoor);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      doorOverlay.style.display = 'none';
      document.body.classList.remove('no-scroll');
    });
  }
});
