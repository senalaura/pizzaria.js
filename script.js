/**
 * CONFIGURAÇÕES GLOBAIS DA PIZZARIA
 */
const configuracao = {
    precos: {
      sabores: {
        margherita: 25.00,
        calabresa: 28.00,
        portuguesa: 30.00,
        'quatro-queijos': 32.00,
        'frango-catupiry': 30.00,
        sorvete: 20.00,
        chocolate: 22.00,
        acai: 24.00,
        'banana-queijo': 26.00
      },
      tamanhos: {
        pequena: 1.0,
        media: 1.3,
        grande: 1.6
      },
      bordas: {
        catupiry: 5.00,
        cheddar: 4.00,
        queijo: 3.00,
        requeijao: 6.00,
        chocolate: 7.00,
        'doce-de-leite': 8.00,
        nutella: 10.00,
        'sem-borda': 0.00
      },
      bebidas: {
        'coca-cola': 8.00,
        guarana: 7.00,
        fanta: 6.00,
        sprite: 6.00,
        pepsi: 7.00,
        'sem-refrigerante': 0.00
      }
    },
    taxasEntrega: {
      'Brasília': 6.00,
      'Gama': 8.00,
      'Taguatinga': 7.00,
      'Brazlândia': 10.00,
      'Sobradinho': 6.50,
      'Planaltina': 12.00,
      'Paranoá': 9.00,
      'Núcleo Bandeirante': 7.50,
      'Ceilândia': 8.50,
      'Guará': 6.00
    },
    cidadesRapidas: ['Brasília', 'Guará', 'Taguatinga']
};

/**
 * CLASSE PRINCIPAL PARA GERENCIAR PEDIDOS
 */
class GerenciadorPedidos {
    constructor() {
      this.quantidadePizzas = 1;
      this.iniciar();
    }
  
    iniciar() {
      this.capturarElementos();
      this.configurarEventos();
      this.atualizarContador();
      this.calcularTotal();
    }
  
    capturarElementos() {
      this.elementos = {
        botaoAdicionar: document.getElementById('botaoAdicionarPizza'),
        containerPizzas: document.getElementById('areaPizzas'),
        seletorCidade: document.getElementById('cidade'),
        seletorBebida: document.getElementById('bebida'),
        elementoTaxa: document.getElementById('taxaEntrega'),
        elementoTotal: document.getElementById('totalPedido'),
        elementoContador: document.getElementById('contadorPizzas'),
        elementoFeedback: document.getElementById('mensagemFeedback'),
        formulario: document.getElementById('formularioPedido'),
        containerFoguete: document.querySelector('.container-foguete'),
        foguete: document.querySelector('.foguete'),
      };
    }
  
    configurarEventos() {
      this.elementos.botaoAdicionar.addEventListener('click', () => this.adicionarPizza());
      this.elementos.seletorCidade.addEventListener('change', () => this.atualizarTaxaEntrega());
      this.elementos.formulario.addEventListener('submit', (e) => this.finalizarPedido(e));
      
      document.querySelectorAll('.entrada-pedido').forEach(input => {
        input.addEventListener('change', () => this.calcularTotal());
      });
    }
  
    adicionarPizza() {
      this.quantidadePizzas++;
      
      const cardPizza = document.createElement('div');
      cardPizza.className = 'card-pizza';
      cardPizza.innerHTML = this.gerarHtmlPizza(this.quantidadePizzas);
      
      this.elementos.containerPizzas.appendChild(cardPizza);
      cardPizza.style.animation = 'slideIn 0.5s ease';
      
      const botaoRemover = cardPizza.querySelector('.remover-pizza');
      botaoRemover.addEventListener('click', () => this.removerPizza(cardPizza));
      
      cardPizza.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => this.calcularTotal());
      });
      
      this.atualizarContador();
      this.calcularTotal();
    }
  
    gerarHtmlPizza(indice) {
      return `
        <div class="cabecalho-pizza">
          <h3>Pizza ${indice}</h3>
          <button type="button" class="botao remover-pizza">
            <i class="fas fa-times"></i> Remover
          </button>
        </div>
        <div class="grupo-formulario">
          <label for="sabor${indice}" class="rotulo">
            <i class="fas fa-pizza-slice"></i> Sabor:
          </label>
          <select id="sabor${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha um sabor</option>
            ${Object.keys(configuracao.precos.sabores).map(sabor => `
              <option value="${sabor}">${this.formatarTexto(sabor)}</option>
            `).join('')}
          </select>
        </div>
        <div class="grupo-formulario">
          <label for="tamanho${indice}" class="rotulo">
            <i class="fas fa-ruler"></i> Tamanho:
          </label>
          <select id="tamanho${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha um tamanho</option>
            ${Object.keys(configuracao.precos.tamanhos).map(tamanho => `
              <option value="${tamanho}">${this.formatarTexto(tamanho)}</option>
            `).join('')}
          </select>
        </div>
        <div class="grupo-formulario">
          <label for="borda${indice}" class="rotulo">
            <i class="fas fa-border-style"></i> Borda:
          </label>
          <select id="borda${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha uma borda</option>
            ${Object.keys(configuracao.precos.bordas).map(borda => `
              <option value="${borda}">${this.formatarTexto(borda)}</option>
            `).join('')}
          </select>
        </div>
      `;
    }
  
    removerPizza(card) {
      card.classList.add('removing');
      setTimeout(() => {
        card.remove();
        this.quantidadePizzas--;
        this.atualizarContador();
        this.calcularTotal();
      }, 500);
    }
  
    atualizarTaxaEntrega() {
      const cidade = this.elementos.seletorCidade.value;
      const taxa = configuracao.taxasEntrega[cidade] || 0;
      this.elementos.elementoTaxa.textContent = `R$ ${taxa.toFixed(2)}`;
      this.calcularTotal();
    }
  
    calcularTotal() {
      let total = 0;
      
      for (let i = 1; i <= this.quantidadePizzas; i++) {
        const sabor = document.getElementById(`sabor${i}`)?.value;
        const tamanho = document.getElementById(`tamanho${i}`)?.value;
        const borda = document.getElementById(`borda${i}`)?.value;
        
        if (!sabor || !tamanho || !borda) continue;
        
        const precoSabor = configuracao.precos.sabores[sabor];
        const multiplicador = configuracao.precos.tamanhos[tamanho];
        const precoBorda = configuracao.precos.bordas[borda];
        
        total += (precoSabor * multiplicador) + precoBorda;
      }
      
      const bebida = this.elementos.seletorBebida.value;
      if (bebida) {
        total += configuracao.precos.bebidas[bebida];
      }
      
      const taxa = parseFloat(this.elementos.elementoTaxa.textContent.replace('R$ ', '')) || 0;
      total += taxa;
      
      this.elementos.elementoTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
  
    calcularTempoEntrega(cidade, qtdPizzas) {
      return configuracao.cidadesRapidas.includes(cidade) 
        ? 30 + (qtdPizzas * 5)
        : 60 + (qtdPizzas * 5);
    }
  
    atualizarContador() {
      this.elementos.elementoContador.textContent = 
        `${this.quantidadePizzas} ${this.quantidadePizzas === 1 ? 'pizza' : 'pizzas'}`;
    }
  
    mostrarFeedback(mensagem, sucesso) {
      this.elementos.elementoFeedback.textContent = mensagem;
      this.elementos.elementoFeedback.className = `mensagem-feedback ${sucesso ? 'sucesso' : 'erro'}`;
      this.elementos.elementoFeedback.style.display = 'block';
      
      setTimeout(() => {
        this.elementos.elementoFeedback.style.display = 'none';
      }, 3000);
    }
  
    formatarTexto(texto) {
      return texto.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  
    finalizarPedido(evento) {
      evento.preventDefault();
      
      // Validações básicas
      const nomeCliente = document.getElementById('nomeCliente').value.trim();
      if (!nomeCliente) {
          this.mostrarFeedback('Por favor, digite seu nome.', false);
          return;
      }
      
      const cidade = this.elementos.seletorCidade.value;
      if (!cidade) {
          this.mostrarFeedback('Por favor, selecione uma cidade.', false);
          return;
      }
      
      const bebida = this.elementos.seletorBebida.value;
      if (!bebida) {
          this.mostrarFeedback('Por favor, selecione uma bebida.', false);
          return;
      }
  
      // Processar pizzas
      const pizzas = [];
      for (let i = 1; i <= this.quantidadePizzas; i++) {
          const saborSelect = document.getElementById(`sabor${i}`);
          const tamanhoSelect = document.getElementById(`tamanho${i}`);
          const bordaSelect = document.getElementById(`borda${i}`);
          
          const sabor = saborSelect ? saborSelect.value : null;
          const tamanho = tamanhoSelect ? tamanhoSelect.value : null;
          const borda = bordaSelect ? bordaSelect.value : null;
          
          if (!sabor || !tamanho || !borda) {
              this.mostrarFeedback(`Preencha todos os campos da Pizza ${i}.`, false);
              return;
          }
          
          // Obter texto exibido nas opções selecionadas
          const saborTexto = saborSelect.options[saborSelect.selectedIndex].text;
          const tamanhoTexto = tamanhoSelect.options[tamanhoSelect.selectedIndex].text;
          const bordaTexto = bordaSelect.options[bordaSelect.selectedIndex].text;
          
          // Calcular preço
          const precoSabor = configuracao.precos.sabores[sabor] || 0;
          const multiplicador = configuracao.precos.tamanhos[tamanho] || 1;
          const precoBorda = configuracao.precos.bordas[borda] || 0;
          const precoPizza = (precoSabor * multiplicador) + precoBorda;
          
          pizzas.push({
              sabor: saborTexto,
              tamanho: tamanhoTexto,
              borda: bordaTexto,
              preco: precoPizza.toFixed(2)
          });
      }
  
      // Processar bebida
      const bebidaSelect = this.elementos.seletorBebida;
      const bebidaTexto = bebidaSelect.options[bebidaSelect.selectedIndex].text;
      const precoBebida = configuracao.precos.bebidas[bebida] || 0;
  
      // Calcular totais
      const taxaEntrega = parseFloat(this.elementos.elementoTaxa.textContent.replace('R$ ', '')) || 0;
      const totalPedido = pizzas.reduce((total, pizza) => total + parseFloat(pizza.preco), 0) + precoBebida + taxaEntrega;
  
      // Criar objeto do pedido
      const pedido = {
        id: Date.now(),
        nomeCliente: nomeCliente,
        cidade: cidade,
        bebida: {
            nome: bebidaTexto,
            preco: precoBebida.toFixed(2)
        },
        taxaEntrega: taxaEntrega.toFixed(2),
        tempoEntrega: this.calcularTempoEntrega(cidade, this.quantidadePizzas),
        pizzas: pizzas,
        total: totalPedido.toFixed(2),
        dataPedido: new Date().toISOString(),
        status: "RECEBIDO"
    };

    // Salvar pedidos
    localStorage.setItem('pedidoAtual', JSON.stringify(pedido));
    
    const todosPedidos = JSON.parse(localStorage.getItem('todosPedidos')) || [];
    todosPedidos.unshift(pedido);
    localStorage.setItem('todosPedidos', JSON.stringify(todosPedidos));

    // Notificar atualização em tempo real
    this.notificarAtualizacao();
    
    this.mostrarFeedback('Pedido realizado com sucesso!', true);
    this.mostrarAnimacaoFoguete();

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('atualizacao_status');
      channel.postMessage({
          id: pedido.id,
          status: "RECEBIDO"
      });
      setTimeout(() => channel.close(), 100);
  }

    setTimeout(() => {
        window.location.href = 'resumo.html';
    }, 3000);
}

// Adicione este novo método
notificarAtualizacao() {
  // Método 1: BroadcastChannel (funciona entre abas/iframes do mesmo navegador)
  if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('pedidos_atualizados');
      channel.postMessage({ atualizado: true });
      setTimeout(() => channel.close(), 1000);
  }
  
  // Método 2: Evento de storage (fallback para navegadores antigos)
  localStorage.setItem('ultimaAtualizacao', Date.now());
}
  
    mostrarAnimacaoFoguete() {
      this.elementos.containerFoguete.classList.add('active');
      this.elementos.foguete.style.animation = 'none';
      void this.elementos.foguete.offsetWidth;
      this.elementos.foguete.style.animation = 'launch 2s ease forwards';
      
      setTimeout(() => {
        this.elementos.containerFoguete.classList.remove('active');
      }, 2000);
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formularioPedido')) {
      new GerenciadorPedidos();
    }
    
    if (document.getElementById('resumoPedido')) {
      criarEfeitoConfete();
    }
});

function criarEfeitoConfete() {
    const cores = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    
    for (let i = 0; i < 100; i++) {
      const confete = document.createElement('div');
      confete.className = 'confetti';
      confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      confete.style.left = `${Math.random() * 100}vw`;
      confete.style.top = '-10px';
      confete.style.width = `${Math.random() * 10 + 5}px`;
      confete.style.height = `${Math.random() * 10 + 5}px`;
      confete.style.animationDuration = `${Math.random() * 3 + 2}s`;
      
      document.body.appendChild(confete);
      
      setTimeout(() => {
        confete.remove();
      }, 5000);
    }
}

// Fila de pedidos (FIFO)
const filaDePedidos = [];

function adicionarPedidoNaFila(pedido) {
    filaDePedidos.push(pedido);
}

function removerPedidoDaFila() {
    return filaDePedidos.shift();
}

// Pilha de ações recentes (LIFO)
const pilhaAcoes = [];

function registrarAcao(acao) {
    pilhaAcoes.push(acao);
}

function desfazerUltimaAcao() {
    return pilhaAcoes.pop();
}

// FUNÇÃO RECURSIVA

function somarValoresRecursivo(pedidos, index = 0) {
    if (index >= pedidos.length) return 0;
    return pedidos[index].valor + somarValoresRecursivo(pedidos, index + 1);
}

// ALGORITMOS DE ORDENAÇÃO

// Bubble Sort por valor
function bubbleSortPedidosPorValor(pedidos) {
    let arr = [...pedidos];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j].valor > arr[j + 1].valor) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Quick Sort por tempo
function quickSortPedidosPorTempo(pedidos) {
    if (pedidos.length <= 1) return pedidos;
    const pivot = pedidos[0];
    const menores = pedidos.slice(1).filter(p => p.tempo < pivot.tempo);
    const maiores = pedidos.slice(1).filter(p => p.tempo >= pivot.tempo);
    return [...quickSortPedidosPorTempo(menores), pivot, ...quickSortPedidosPorTempo(maiores)];
}

// RELATÓRIO DE ESTATÍSTICAS

function gerarRelatorio(pedidos) {
    const total = pedidos.length;
    const soma = somarValoresRecursivo(pedidos);
    const media = total > 0 ? (soma / total).toFixed(2) : 0;

    console.log("===== RELATÓRIO =====");
    console.log("Total de pedidos:", total);
    console.log("Valor médio:", media);
    console.log("Pedidos ordenados por valor (Bubble Sort):", bubbleSortPedidosPorValor(pedidos));
    console.log("Pedidos ordenados por tempo (Quick Sort):", quickSortPedidosPorTempo(pedidos));
}

// EXEMPLO DE USO

const pedidosTeste = [
    { id: 1, valor: 50.0, tempo: 20 },
    { id: 2, valor: 30.0, tempo: 10 },
    { id: 3, valor: 60.0, tempo: 15 }
];

pedidosTeste.forEach(p => adicionarPedidoNaFila(p));
registrarAcao("Adicionado pedido 1");
registrarAcao("Adicionado pedido 2");
registrarAcao("Adicionado pedido 3");

gerarRelatorio(pedidosTeste);
