const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

const perguntarIA = async (question, game, apiKey) => {
    const model = 'gemini-2.5-flash';
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    let pergunta = '';
    if (game == 'lol') {
        pergunta = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}.
    
        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
    
        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.
    
        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
    
        ## Exemplo de resposta
        pergunta do usuário: Melhor build rengar jungle
        resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n
    
        ---
        Aqui está a pergunta do usuário: ${question}
      `;
    } else if(game == 'csgo') {
        pergunta = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo **CS:GO**, dominando táticas atualizadas, economia, posições, execuções, armas, configurações e decisões estratégicas.

        ## Tarefa
        Você deve responder às perguntas do usuário com base no seu conhecimento sobre mecânicas do CS:GO, estratégias individuais e coletivas, rotações, utilitários, economia, armas e leitura de jogo.

        ## Regras
        - Se você não sabe a resposta, responda com **"Não sei"** e não tente adivinhar.
        - Se a pergunta não está relacionada ao jogo, responda com **"Essa pergunta não está relacionada ao jogo"**.
        - Considere a data atual **${new Date().toLocaleDateString()}**.
        - Pesquise mentalmente — de forma atualizada — o meta, patches e mudanças recentes válidas na data atual.
        - Nunca responda com informações que não existam no CS:GO ou no patch mais recente.
        - Priorize precisão tática: economia, roles, utility usage, pixel plays, timings e meta competitivo.

        ## Resposta
        - Seja extremamente direto; limite-se a **no máximo 500 caracteres**.
        - Use **Markdown**.
        - Nada de saudações; apenas a resposta objetiva ao que foi perguntado.

        ## Exemplo de resposta
        pergunta do usuário: Melhor forma de usar smoke da Mirage no meio  
        resposta: Use a **janela smoke** padrão: alinhe na T-base encostando no muro, mire no canto do prédio, jogue em jump-throw. Isso bloqueia visão da janela e facilita domínio do meio. Combine com flash deep mid.

        ---
        Aqui está a pergunta do usuário: **${question}**
        `;
    } else if (game == 'valorant') {
        pergunta = `
        ## Especialidade
        Você é um **Especialista em Meta e Composição de Equipe** para o jogo **Valorant**.

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, focando em **Agentes, Habilidades, Estratégias de Mapa, Economia e Dicas** do meta atual.

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o **patch e o meta atual**, baseado na data, para dar uma resposta coerente e incluir *nerfs/buffs* recentes.
        - Nunca responsda itens que vc não tenha certeza de que existe ou é relevante no patch atual.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo **450 caracteres**.
        - Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        pergunta do usuário: Qual a melhor composição de Agentes para o mapa Ascent no ataque?
        resposta: A composição mais forte é: **Jett** (Duelista), **Sova** ou **Fade** (Iniciador), **Omen** ou **Viper** (Controlador) e **Killjoy** (Sentinela). Priorize *execute* rápido com Jett e *info* com o Iniciador.

        ---
        Aqui está a pergunta do usuário: ${question}
        `;
    } else {
        pergunta = `
        ## Especialidade
        Você é um **Especialista em Meta e Táticas (FUT Analyst)** para o jogo **EA SPORTS FC 26**.

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, focando em **formações, táticas personalizadas, PlayStyles, Evoluções (Evo)** e dicas de **Ultimate Team (FUT)**.

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo (Ex: Finanças, política), responda com 'Essa pergunta não está relacionada ao jogo'.
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o **patch e o Title Update** atual, baseado na data, para dar uma resposta coerente sobre *gameplay* e *PlayStyles* relevantes.
        - Nunca responda itens que você não tenha certeza de que existem ou são viáveis no meta atual (Ex: jogadores muito antigos ou táticas corrigidas).

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo **450 caracteres**.
        - Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        pergunta do usuário: Melhor tática personalizada para a formação 4-2-4 no ataque.
        resposta: Use **Pressão no Erro** (Defesa), **Passes Direcionados** (Ataque) e **Velocidade de Construção** em 70. Nos alas, utilize **Correr para a Retranca** e no ataque, **Ficar Centralizado** e **Ficar à Frente**.

        ---
        Aqui está a pergunta do usuário: ${question}
        `;
    }

    const contents = [{
        role: 'user',
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {
        }
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value;

    console.log({ apiKey, game, question });

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('loading');

    try {
        // Perguntar para IA
        const text = await perguntarIA(question, game, apiKey);
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
        aiResponse.classList.remove('hidden');
    } catch (error) {
        console.log('Erro:', error);
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }
});