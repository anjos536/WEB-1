let vidas;
let palavras = []; // Inicializa como array vazio
let palavraAtual;
let numPalavra;
let exibicao;

let btnIniciar = document.getElementById("btn_iniciar");
// ... outras variáveis ...

// Essa linha é OBRIGATÓRIA para o botão funcionar:
btnIniciar.addEventListener("click", novoJogo);
let imagem = document.getElementById("img-menino");
let palavra = document.getElementById("palavra");
// ✅ ADICIONADO: Pega a referência da caixa do teclado para habilitar depois
let boxTeclado = document.getElementById("box-teclado"); 

// ✅ CORREÇÃO: Adicionamos um listener ao botão para iniciar o jogo.
// Quando clicado, ele inicia um jogo do zero.
btnIniciar.addEventListener("click", function() {
    // Se as palavras ainda não foram carregadas, não faz nada
    if (palavras.length === 0) {
        alert("Aguarde o carregamento das palavras...");
        return;
    }
    novoJogo();
});


iniciar(); // executa o fluxo principal ao abrir a página

// Função principal que prepara o ambiente
async function iniciar() {
    await carregarFase(); // espera as palavras carregarem
    // ✅ CORREÇÃO: Não iniciamos o jogo automaticamente.
    // Deixamos o usuário clicar no botão "Iniciar".
    palavra.textContent = "Clique em INICIAR para começar!";
    boxTeclado.innerHTML = ""; // Limpa o teclado antes de começar
}


function novoJogo() {
    numPalavra = 0;
    vidas = 6;
    // ✅ CORREÇÃO: Garante que a imagem inicial esteja correta, sem a pasta "assets"
    imagem.src = "menino1.png"; 
    carregarPalavra(numPalavra);
    // Reabilita o teclado caso esteja desabilitado de um jogo anterior
    boxTeclado.style.pointerEvents = "auto";
    boxTeclado.style.opacity = "1";
}


function carregarPalavra(numPalavra) {
    // ✅ CORREÇÃO DE SEGURANÇA:
    // Verifica se a palavra existe antes de tentar carregar. Evita erro no final do jogo.
    if(!palavras[numPalavra]){
        alert("🎉 Parabéns! Você zerou todas as palavras!");
        desativarTeclado();
        return;
    }

    palavraAtual = String(palavras[numPalavra]).toUpperCase();
    exibicao = [];

    for (let i = 0; i < palavraAtual.length; i++) {
        exibicao[i] = '_';
    }
    palavra.textContent = exibicao.join(" ");
    carregarTeclado();
    // return palavras[numPalavra]; // Não é necessário retornar nada aqui
}


function carregarTeclado() {
    boxTeclado.innerHTML = ""; // limpa o conteúdo anterior

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < letras.length; i++) {
        let botao = document.createElement("button");
        botao.textContent = letras[i];
        // Adiciona uma classe para estilizar no CSS se quiser (opcional)
        botao.className = "btn-teclado"; 

        botao.addEventListener("click", function () {
            verificarLetra(letras[i], botao);
        });

        boxTeclado.appendChild(botao);
    }
}


function verificarLetra(letra, botao) {
    botao.disabled = true;
    // Opcional: mudar a cor do botão clicado visualmente
    botao.style.backgroundColor = "#ccc"; 
    
    let acertou = false;

    for (let i = 0; i < palavraAtual.length; i++) {
        if (palavraAtual[i] === letra) {
            exibicao[i] = letra;
            acertou = true;
        }
    }
    palavra.textContent = exibicao.join(" ");

    if (acertou == false) {
        vidas--;
        
        // ✅ CORREÇÃO CRÍTICA DO CAMINHO DA IMAGEM:
        // O cálculo da imagem é:
        // 6 vidas = menino1.png (7-6)
        // 5 vidas = menino2.png (7-5)
        // ...
        // 0 vidas = menino7.png (7-0)
        if (vidas >= 0) {
            // Removemos o "assets/" pois suas imagens estão na raiz
            imagem.src = "menino" + (7 - vidas) + ".png";
        }
    }

    // Verifica Fim de Jogo (Derrota)
    if (vidas === 0) {
        // Usamos setTimeout para o navegador ter tempo de atualizar a última imagem do boneco antes do alerta
        setTimeout(() => {
             alert("😢 Fim de jogo! A palavra era: " + palavraAtual);
             desativarTeclado();
        }, 100);
    }
    
    // Verifica Vitória da rodada
    if (!exibicao.includes("_")) {
         // setTimeout para ver a palavra completa antes do alerta
        setTimeout(() => {
            alert("🎉 Parabéns! Você acertou a palavra: " + palavraAtual);
            numPalavra++;
            carregarPalavra(numPalavra); // Carrega a próxima
        }, 100);
    }
}

function desativarTeclado() {
    // Uma forma visualmente mais clara de desativar o teclado inteiro
    boxTeclado.style.pointerEvents = "none";
    boxTeclado.style.opacity = "0.5";
}

// ✅ ALTERAÇÃO PARA TESTE IMEDIATO
// Modifiquei esta função para usar uma lista fixa, assim você pode testar agora mesmo.
// Se quiser usar o JSON depois, descomente a parte do fetch e comente a lista fixa.

async function carregarFase() {
    // Lista de palavras fixa para o jogo funcionar imediatamente
    palavras = ["BANANA", "UVA", "ABACAXI", "LARANJA", "MORANGO", "LIMAO"];
    console.log("Palavras carregadas!");
}
    // --- MODO JSON (Original) ---
    /* Se você tiver o arquivo fases.json funcionando, use este bloco:
    try {
        const response = await fetch("fases.json");
        const data = await response.json();
        palavras = data.frutas;
        console.log("Palavras carregadas do JSON!");

    } catch (error) {
        console.error("Erro ao carregar fases.json:", error);
        alert("Erro ao carregar as palavras. Verifique o arquivo json.");
        // Palavras de fallback caso o JSON falhe
        palavras = ["ERRO", "JSON"]; 
    }
    */
