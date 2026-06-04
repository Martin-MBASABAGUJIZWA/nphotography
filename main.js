/* ─── n photography · main.js ──────────────────────────────────
   Generates a live QR code pointing to this page's URL,
   and lets visitors download it as a standalone SVG.
   ──────────────────────────────────────────────────────────── */

(function () {
  "use strict";

    /* ── 1. Canonical QR URL ───────────────────────────────────
      Use a fixed, production URL so the printed QR always
      points to the live site regardless of hosting context. */
    const pageURL = "https://nphotography.vercel.app";

  /* Update the small label under the QR card */
  const urlLabel = document.getElementById("qr-url-display");
  if (urlLabel) {
    try {
      urlLabel.textContent = new URL(pageURL).hostname;
    } catch (_) {
      urlLabel.textContent = pageURL;
    }
  }

  /* ── 2. Render the QR code (canvas) ─────────────────────────
     QRCode.js drops a <canvas> + <img> inside #qr-wrap.        */
  const wrap = document.getElementById("qr-wrap");

  const qr = new QRCode(wrap, {
    text: pageURL,
    width: 172,
    height: 172,
    colorDark: "#3b2b1e",   /* brand brown */
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H, /* highest error-correction */
  });

  /* ── 3. SVG QR builder ───────────────────────────────────────
     We build a clean, self-contained SVG from scratch using the
     same QR matrix so the download file is fully vector.        */

  /**
   * Generate a minimal QR matrix (boolean 2-D array).
   * We re-use the hidden QRCode instance but read its _oQRCode
   * internal matrix. If that's unavailable we fall back to a
   * canvas-pixel scan.
   */
  function getQRMatrix() {
    /* Attempt internal access (works with qrcodejs) */
    try {
      const inner = qr._oQRCode;
      if (inner && inner.modules) {
        return inner.modules; /* 2-D array of booleans */
      }
    } catch (_) {}

    /* Fallback: read pixels from the canvas */
    const canvas = wrap.querySelector("canvas");
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    /* Estimate module count from canvas size */
    const moduleCount = Math.round(Math.sqrt(width * width)); /* approx */
    const cellSize = width / moduleCount;
    const matrix = [];
    for (let row = 0; row < moduleCount; row++) {
      matrix[row] = [];
      for (let col = 0; col < moduleCount; col++) {
        const px = Math.round((row + 0.5) * cellSize);
        const py = Math.round((col + 0.5) * cellSize);
        const idx = (px * width + py) * 4;
        matrix[row][col] = data[idx] < 128; /* dark pixel → true */
      }
    }
    return matrix;
  }

  /**
   * Build a fully-styled, self-contained SVG string from the matrix.
   * Includes the brand colour palette, a white quiet-zone, and
   * the "n photography" wordmark at the bottom.
   */
  function buildSVG(matrix) {
    const N = matrix.length;
    const quiet = 4;              /* quiet-zone modules */
    const total = N + quiet * 2;
    const cell = 8;               /* px per module in the SVG */
    const size = total * cell;
    const logoH = 40;             /* height reserved for wordmark */
    const svgH = size + logoH;

    /* ── Collect dark-module rects ── */
    let rects = "";
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c]) {
          const x = (c + quiet) * cell;
          const y = (r + quiet) * cell;
          rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#3b2b1e"/>`;
        }
      }
    }

    /* ── Camera-lens icon path (centred in logo area) ── */
    const lx = size / 2 - 14;
    const ly = size + 8;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${size} ${svgH}"
     width="${size}" height="${svgH}"
     role="img"
     aria-label="QR code for n photography">
  <title>n photography — QR code</title>
  <desc>Scan to visit ${pageURL}</desc>

  <!-- Background -->
  <rect width="${size}" height="${svgH}" rx="12" ry="12" fill="#ffffff"/>

  <!-- Corner-bracket accents (decorative) -->
  <polyline points="12,28 12,12 28,12" fill="none" stroke="#c8d96e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${size - 28},12 ${size - 12},12 ${size - 12},28" fill="none" stroke="#c8d96e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="12,${size - 28} 12,${size - 12} 28,${size - 12}" fill="none" stroke="#c8d96e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${size - 28},${size - 12} ${size - 12},${size - 12} ${size - 12},${size - 28}" fill="none" stroke="#c8d96e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- QR modules -->
  ${rects}

  <!-- Wordmark bar -->
  <rect x="0" y="${size}" width="${size}" height="${logoH}" rx="0" ry="0" fill="#3b2b1e"/>
  <rect x="0" y="${size}" width="${size}" height="2" fill="#c8d96e" opacity="0.5"/>

  <!-- Camera shutter icon -->
  <g transform="translate(${lx}, ${ly})">
    <circle cx="14" cy="12" r="11" stroke="#c8d96e" stroke-width="1.6" fill="none"/>
    <circle cx="14" cy="12" r="5" stroke="#c8d96e" stroke-width="1.6" fill="none"/>
    <circle cx="14" cy="12" r="2" fill="#c8d96e"/>
    <line x1="14" y1="1"  x2="14" y2="5"  stroke="#c8d96e" stroke-width="1.4"/>
    <line x1="14" y1="19" x2="14" y2="23" stroke="#c8d96e" stroke-width="1.4"/>
    <line x1="3"  y1="12" x2="7"  y2="12" stroke="#c8d96e" stroke-width="1.4"/>
    <line x1="21" y1="12" x2="25" y2="12" stroke="#c8d96e" stroke-width="1.4"/>
  </g>

  <!-- Brand text -->
  <text x="${lx + 32}" y="${ly + 9}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="11" font-weight="bold" fill="#c8d96e" letter-spacing="1">n photography</text>
  <text x="${lx + 32}" y="${ly + 22}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="7.5" fill="rgba(200,217,110,0.6)" letter-spacing="0.5">your story through our lens</text>
</svg>`;
  }

  /* ── 4. Download SVG on button click ─────────────────────── */
  const btnDownload = document.getElementById("btn-download-svg");
  if (btnDownload) {
    btnDownload.addEventListener("click", function () {
      /* Small delay to ensure QR is fully rendered */
      setTimeout(function () {
        const matrix = getQRMatrix();
        if (!matrix) {
          alert("QR code not ready yet — please try again in a moment.");
          return;
        }
        const svgString = buildSVG(matrix);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nphotography-qr.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }

  /* ── 5. Subtle scroll-reveal for QR section ─────────────── */
  const qrSection = document.getElementById("qr-section");
  if (qrSection && "IntersectionObserver" in window) {
    qrSection.style.opacity = "0";
    qrSection.style.transform = "translateY(30px)";
    qrSection.style.transition = "opacity .7s ease, transform .7s ease";

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            qrSection.style.opacity = "1";
            qrSection.style.transform = "translateY(0)";
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(qrSection);
  }
})();
