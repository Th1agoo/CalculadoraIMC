// Aguarda todo o HTML ser carregado antes de rodar qualquer código JS
document.addEventListener('DOMContentLoaded', function () {

    // Seleciona o formulário de IMC pelo ID
    const form = document.getElementById('form-imc');

    // Adiciona um evento para quando o formulário for enviado (submit)
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)

        // --- CAPTURA OS DADOS DIGITADOS PELO USUÁRIO ---

        const nome = document.getElementById('nome').value.trim(); // Pega o nome e remove espaços extras
        const altura = parseFloat(document.getElementById('altura').value); // Converte a altura para número com ponto
        const peso = parseFloat(document.getElementById('peso').value);     // Converte o peso para número com ponto

        // --- VALIDAÇÃO BÁSICA ---

        // Verifica se o nome está vazio ou se altura/peso são inválidos (NaN = Not a Number)
        if (!nome || isNaN(altura) || isNaN(peso)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return; // Sai da função se algum campo for inválido
        }

        // --- CALCULA O IMC USANDO FUNÇÃO SEPARADA ---
        const imc = calcularIMC(peso, altura); // Chama a função e guarda o valor do IMC

        // --- DEFINE A CLASSIFICAÇÃO DO IMC ---
        const classificacao = classificarIMC(imc); // Chama a função que classifica o resultado

        // --- MOSTRA O RESULTADO NA TELA ---
        mostrarResultado(nome, imc, classificacao); // Exibe o resultado final formatado

        // --- SALVA O HISTÓRICO ---
        salvarHistorico(nome, peso, altura, imc, classificacao);
    });

    document.getElementById('altura').addEventListener('input', function (e) {
        let value = this.value.replace(/[^0-9]/g, ''); // Remove qualquer caractere que não seja número
        if (value.length > 1) {
            value = value.slice(0, 1) + '.' + value.slice(1); // Insere o ponto após o primeiro dígito
        }
        this.value = value.slice(0, 4); // Limita a altura a 4 caracteres (ex.: "1.75")
    });

    document.getElementById('peso').addEventListener('input', function (e) {
        let value = this.value.replace(/[^0-9]/g, ''); // Remove qualquer caractere que não seja número
        if (value.length > 2) {
            value = value.slice(0, value.length - 2) + '.' + value.slice(value.length - 2); // Insere o ponto antes dos dois últimos dígitos
        }
        this.value = value.slice(0, 5); // Limita o peso a 5 caracteres (ex.: "68.00")
    });

    // Exemplo de validação em tempo real
    document.getElementById('form-imc').addEventListener('input', function (e) {
        const altura = document.getElementById('altura');
        const peso = document.getElementById('peso');
        const nome = document.getElementById('nome');

        if (!nome.value.trim()) {
            nome.setCustomValidity('O nome é obrigatório.');
        } else {
            nome.setCustomValidity('');
        }

        if (altura.value && (parseFloat(altura.value) <= 0 || parseFloat(altura.value) > 3)) {
            altura.setCustomValidity('Altura deve ser entre 0.5 e 3 metros.');
        } else {
            altura.setCustomValidity('');
        }

        if (peso.value && (parseFloat(peso.value) <= 0 || parseFloat(peso.value) > 300)) {
            peso.setCustomValidity('Peso deve ser entre 1 e 300 kg.');
        } else {
            peso.setCustomValidity('');
        }
    });

    document.querySelector('.botao.limpar').addEventListener('click', function () {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.style.display = 'none';
        resultadoDiv.classList.remove('visible');
    });
});

// -----------------------------------------------------------------------
// Função que calcula o IMC com base no peso e altura
function calcularIMC(peso, altura) {
    // Fórmula: peso dividido por altura ao quadrado
    const resultado = peso / (altura * altura);
    return resultado.toFixed(2); // Arredonda o número para 2 casas decimais
}

// -----------------------------------------------------------------------
// Função que classifica o IMC de acordo com faixas definidas pela OMS
function classificarIMC(imc) {
    if (imc < 18.5) {
        return 'Abaixo do peso';
    } else if (imc < 24.9) {
        return 'Peso normal';
    } else if (imc < 29.9) {
        return 'Sobrepeso';
    } else if (imc < 34.9) {
        return 'Obesidade grau 1';
    } else if (imc < 39.9) {
        return 'Obesidade grau 2';
    } else {
        return 'Obesidade grau 3';
    }
}

// -----------------------------------------------------------------------
// Função que exibe o resultado final formatado dentro da div "resultado"
function mostrarResultado(nome, imc, classificacao) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.display = 'block';

    // Adiciona classe para animação
    setTimeout(() => resultadoDiv.classList.add('visible'), 10);

    // Adiciona cor baseada na classificação
    const corClasse = {
        'Abaixo do peso': '#ffd700',
        'Peso normal': '#90EE90',
        'Sobrepeso': '#FFA07A',
        'Obesidade grau 1': '#FF6B6B',
        'Obesidade grau 2': '#FF4040',
        'Obesidade grau 3': '#FF0000'
    };

    // Obtém as dicas para a classificação atual
    const dicas = dicasSaude[classificacao];

    resultadoDiv.style.backgroundColor = corClasse[classificacao];
    resultadoDiv.innerHTML = `
        <p>${nome}, seu IMC é: <strong>${imc}</strong>.</p>
        <p>Classificação: <strong>${classificacao}</strong></p>
        
        <div class="dicas-saude">
            <h3>Dicas de Saúde:</h3>
            <ul>
                ${dicas.map(dica => `<li>${dica}</li>`).join('')}
            </ul>
        </div>
    `;
}

// -----------------------------------------------------------------------
// Dicas de saúde baseadas na classificação do IMC
const dicasSaude = {
    'Abaixo do peso': [
        'Consulte um nutricionista para uma dieta balanceada',
        'Pratique exercícios de força com supervisão',
        'Aumente a ingestão de proteínas magras'
    ],
    'Peso normal': [
        'Continue mantendo hábitos saudáveis',
        'Pratique atividades físicas regularmente',
        'Mantenha uma alimentação equilibrada'
    ],
    'Sobrepeso': [
        'Aumente a prática de exercícios aeróbicos',
        'Reduza o consumo de açúcares e gorduras',
        'Busque acompanhamento profissional'
    ],
    'Obesidade grau 1': [
        'Consulte um médico especialista',
        'Inicie um programa de exercícios supervisionado',
        'Faça mudanças graduais na alimentação'
    ],
    'Obesidade grau 2': [
        'Procure ajuda médica com urgência',
        'Siga um plano alimentar específico',
        'Realize atividades físicas com supervisão'
    ],
    'Obesidade grau 3': [
        'Busque atendimento médico imediato',
        'Siga rigorosamente as orientações médicas',
        'Considere acompanhamento psicológico'
    ]
};

// -----------------------------------------------------------------------
// Função que salva o histórico de medições no localStorage
function salvarHistorico(nome, peso, altura, imc, classificacao) {
    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();

    let historico = JSON.parse(localStorage.getItem('historicoIMC') || '[]');

    historico.push({
        data,
        hora,
        nome,
        peso,
        altura,
        imc,
        classificacao
    });

    // Mantém apenas os últimos 10 registros
    if (historico.length > 10) {
        historico = historico.slice(-10);
    }

    localStorage.setItem('historicoIMC', JSON.stringify(historico));
}

// -----------------------------------------------------------------------
// Função que exibe o histórico de medições formatado
function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoIMC') || '[]');
    if (historico.length === 0) return '';

    return `
        <div class="historico">
            <h3>Histórico de Medições</h3>
            <div class="historico-lista">
                ${historico.reverse().map(registro => `
                    <div class="historico-item">
                        <small>${registro.data} - ${registro.hora}</small>
                        <p>IMC: <strong>${registro.imc}</strong> (${registro.classificacao})</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
