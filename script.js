document.getElementById('btn-calcular').addEventListener('click', function() {
    // Captura dos elementos de entrada
    const massa = parseFloat(document.getElementById('massa').value);
    const distancia = parseFloat(document.getElementById('distancia').value);
    const tempo = parseFloat(document.getElementById('tempo').value);

    // Validação básica dos dados de entrada
    if (isNaN(massa) || isNaN(distancia) || isNaN(tempo) || tempo <= 0 || massa < 0 || distancia < 0) {
        alert("Por favor, insira valores válidos e positivos. O tempo deve ser maior que zero.");
        return;
    }

    // 1. Cálculo da Aceleração (Considerando partida do repouso: d = (a * t^2) / 2)
    // Logo: a = (2 * d) / t^2
    const aceleracao = (2 * distancia) / Math.pow(tempo, 2);

    // 2. Cálculo da Força (F = m * a)
    const forca = massa * aceleracao;

    // 3. Cálculo do Trabalho / Energia (W = F * d)
    const energia = forca * distancia;

    // 4. Cálculo da Potência (P = W / t)
    const potencia = energia / tempo;

    // Renderização dos dados na tela formatados com duas casas decimais
    document.getElementById('res-aceleracao').innerText = `${aceleracao.toFixed(2)} m/s²`;
    document.getElementById('res-forca').innerText = `${forca.toFixed(2)} N`;
    document.getElementById('res-energia').innerText = `${energia.toFixed(2)} J`;
    document.getElementById('res-potencia').innerText = `${potencia.toFixed(2)} W`;
});

