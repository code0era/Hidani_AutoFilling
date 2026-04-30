export const injectOverlay = (onAutofill: () => void) => {
  // Prevent multiple injections
  if (document.getElementById('autoform-overlay')) return;

  const container = document.createElement('div');
  container.id = 'autoform-overlay';
  container.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const shadow = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    .fab {
      width: 60px;
      height: 60px;
      border-radius: 20px;
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .fab:hover {
      transform: scale(1.1) translateY(-5px);
      box-shadow: 0 15px 30px rgba(124, 58, 237, 0.6);
    }

    .fab:active {
      transform: scale(0.95);
    }

    .fab svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .tooltip {
      position: absolute;
      right: 75px;
      top: 50%;
      transform: translateY(-50%) translateX(20px);
      background: #18181b;
      color: white;
      padding: 8px 15px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .fab:hover .tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    .pulse {
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: rgba(124, 58, 237, 0.4);
      z-index: -1;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
  `;

  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.innerHTML = `
    <div class="pulse"></div>
    <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    <div class="tooltip">AutoFill with AI</div>
  `;

  fab.onclick = (e) => {
    e.preventDefault();
    onAutofill();
  };

  shadow.appendChild(style);
  shadow.appendChild(fab);
  document.body.appendChild(container);
};
