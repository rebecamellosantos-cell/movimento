// script.js - cálculos de física simples (português)
(function(){
  const $ = id => document.getElementById(id);

  const timeInput = $('time');
  const distanceInput = $('distance');
  const massInput = $('mass');

  const velEl = $('vel');
  const accEl = $('acc');
  const forceEl = $('force');
  const energyEl = $('energy');
  const powerEl = $('power');
  const errorEl = $('error');

  const calcBtn = $('calculate');
  const resetBtn = $('reset');

  function format(v){
    if (v === null || v === undefined || Number.isNaN(v)) return '—';
    // usar notação curta quando muito grande
    if (!isFinite(v)) return '∞';
    return Number(v).toLocaleString('pt-BR', {maximumFractionDigits:3});
  }

  function clearResults(){
    velEl.textContent = '—';
    accEl.textContent = '—';
    forceEl.textContent = '—';
    energyEl.textContent = '—';
    powerEl.textContent = '—';
    errorEl.textContent = '';
  }

  function calculate(){
    errorEl.textContent = '';
    const t = parseFloat(timeInput.value);
    const d = parseFloat(distanceInput.value);
    const m = parseFloat(massInput.value);

    // validações básicas
    if (isNaN(t) || isNaN(d) || isNaN(m)) {
      errorEl.textContent = 'Preencha tempo, distância e massa com valores numéricos.';
      clearResults();
      return;
    }
    if (t <= 0) {
      errorEl.textContent = 'O tempo deve ser maior que zero (t > 0).';
      clearResults();
      return;
    }
    if (d < 0 || m < 0) {
      errorEl.textContent = 'Distância e massa não podem ser negativas.';
      clearResults();
      return;
    }

    // cálculos
    // velocidade média (m/s)
    const v = d / t;

    // assumindo que parte do repouso e aceleração média constante:
    // a = v / t
    const a = v / t;

    // força média (N)
    const F = m * a;

    // energia cinética final (J) E = 1/2 m v^2
    const E = 0.5 * m * v * v;

    // potência média (W) P = E / t
    const P = (t > 0) ? (E / t) : null;

    // mostrar
    velEl.textContent = format(v);
    accEl.textContent = format(a);
    forceEl.textContent = format(F);
    energyEl.textContent = format(E);
    powerEl.textContent = format(P);
  }

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', function(){
    timeInput.value = '';
    distanceInput.value = '';
    massInput.value = '';
    clearResults();
  });

  // Permitir Enter no teclado para calcular quando em um dos inputs
  [timeInput, distanceInput, massInput].forEach(inp => {
    inp.addEventListener('keydown', function(e){
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    });
  });

  // inicializar
  clearResults();
})();
