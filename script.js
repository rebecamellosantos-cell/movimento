// Interações do site: menu, movimento uniforme, calculadora, teste de visão, teste de audição.

document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle mobile
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuBtn && menuBtn.addEventListener('click', () => {
    nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
  });

  // Movimento uniforme: s = v * t
  const muCalcBtn = document.getElementById('mu-calc');
  muCalcBtn && muCalcBtn.addEventListener('click', () => {
    const v = parseFloat(document.getElementById('mu-vel').value) || 0;
    const t = parseFloat(document.getElementById('mu-tempo').value) || 0;
    const s = v * t;
    document.getElementById('mu-resultado').textContent = `Distância: ${s.toLocaleString()} m`;
  });

  // Calculadora científica básica
  const calcDisplay = document.getElementById('calc-display');
  document.querySelectorAll('.calc-buttons button[data-value]').forEach(btn => {
    btn.addEventListener('click', () => {
      calcDisplay.value = (calcDisplay.value || '') + btn.dataset.value;
    });
  });
  document.getElementById('calc-clear').addEventListener('click', () => calcDisplay.value = '');
  document.getElementById('calc-eval').addEventListener('click', () => {
    if (!calcDisplay.value) return;
    try {
      // Permitir Math.* funções. Avaliação controlada:
      const safe = calcDisplay.value
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/[^-()\d/*+.%,Mathpowinsctanlogre]/g, (m) => m); // permissivo p/ funções Math
      // Usaremos Function para avaliar; cuidado em produção.
      const result = Function('"use strict"; return (' + calcDisplay.value + ')')();
      calcDisplay.value = String(result);
    } catch (e) {
      calcDisplay.value = 'Erro';
    }
  });

  // VISÃO — Teste simples de acuidade
  const letters = 'EFPTOLZC';
  const visionLetter = document.getElementById('vision-letter');
  const visionInput = document.getElementById('vision-input');
  const visionFeedback = document.getElementById('vision-feedback');
  const visionStart = document.getElementById('vision-start');
  const visionCheck = document.getElementById('vision-check');

  const sizes = [64, 48, 36, 28, 22, 18, 14, 12]; // progressive sizes
  let currentStep = 0;
  let currentChar = '';

  function showNextVision() {
    if (currentStep >= sizes.length) {
      visionFeedback.textContent = 'Teste concluído. Resultado: não identificou as letras mais pequenas.';
      return;
    }
    currentChar = letters[Math.floor(Math.random() * letters.length)];
    visionLetter.textContent = currentChar;
    visionLetter.style.fontSize = sizes[currentStep] + 'px';
    visionInput.value = '';
    visionFeedback.textContent = `Tamanho atual: ${sizes[currentStep]}px`;
  }

  visionStart && visionStart.addEventListener('click', () => {
    currentStep = 0;
    visionFeedback.textContent = '';
    showNextVision();
  });

  visionCheck && visionCheck.addEventListener('click', () => {
    const answer = (visionInput.value || '').trim().toUpperCase();
    if (!answer) { visionFeedback.textContent = 'Digite a letra que você viu.'; return; }
    if (answer === currentChar) {
      visionFeedback.textContent = `Correto! Passando para letra menor.`;
      currentStep++;
      setTimeout(showNextVision, 700);
    } else {
      visionFeedback.textContent = `Incorreto. A letra correta era "${currentChar}". Teste finalizado.`;
    }
  });

  // AUDIO — Teste simples de tons com Web Audio
  let audioCtx = null;
  const htPlay = document.getElementById('ht-play');
  const htHeard = document.getElementById('ht-heard');
  const htReset = document.getElementById('ht-reset');
  const htVolume = document.getElementById('ht-volume');
  const htFreq = document.getElementById('ht-frequency');
  const htFeedback = document.getElementById('ht-feedback');
  let lastPlayed = null;
  let heardList = [];

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, gainVal = 0.5, duration = 1.0) {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = gainVal;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    lastPlayed = {freq, gainVal, time: Date.now()};
    setTimeout(()=>{ osc.stop(); }, duration * 1000);
  }

  htPlay && htPlay.addEventListener('click', () => {
    const f = parseFloat(htFreq.value);
    const vol = parseFloat(htVolume.value);
    playTone(f, vol, 1.0);
    htFeedback.textContent = `Tocando ${f} Hz — se ouvir, clique em "Ouviu".`;
  });

  htHeard && htHeard.addEventListener('click', () => {
    if (!lastPlayed) {
      htFeedback.textContent = 'Primeiro toque um tom (clique em "Tocar tom").';
      return;
    }
    heardList.push(lastPlayed);
    htFeedback.textContent = `Registrado: ouviu ${lastPlayed.freq} Hz a volume ${lastPlayed.gainVal}. Total: ${heardList.length}.`;
  });

  htReset && htReset.addEventListener('click', () => {
    heardList = [];
    lastPlayed = null;
    htFeedback.textContent = 'Resetado.';
  });

  // Pequena melhoria de UX: permitir Enter no campo de visão
  visionInput && visionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') visionCheck.click();
  });

  // Scroll suave para navegação (melhora a UX)
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  });

});
