# Desafio Cypress QA

Projeto de automação de testes end-to-end (E2E) utilizando Cypress para o site **lojaebac.ebaconline.art.br**.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, seguindo as melhores práticas de automação de testes e as recomendações do entrevistador:

- ✅ Uso extensivo de **Commands customizados** para evitar código básico
- ✅ **Page Objects** bem organizados sem herança desnecessária
- ✅ **Comentários detalhados** em todo o código
- ✅ Padrão **BDD (Given/When/Then)** nos testes
- ✅ Estrutura fácil de manter e escalar

## 🎯 Cenários Automatizados

### 1. **Login** (Cenário Crítico)
**Justificativa:** O login é o ponto de entrada para todas as funcionalidades que requerem autenticação. Qualquer falha aqui impede o acesso a funcionalidades essenciais do e-commerce como checkout, histórico de pedidos, etc.

**Cenários cobertos:**
- Login com credenciais válidas
- Validação de email inválido
- Validação de senha inválida
- Funcionalidade "Lembrar-me"
- Recuperação de senha
- Logout

### 2. **Carrinho de Compras** (Cenário Crítico)
**Justificativa:** O carrinho é fundamental no e-commerce, pois é onde o cliente gerencia os produtos antes de finalizar a compra. Qualquer falha pode resultar em perda de vendas ou problemas no checkout.

**Cenários cobertos:**
- Adicionar produto ao carrinho
- Adicionar múltiplas quantidades
- Remover produto do carrinho
- Atualizar quantidade
- Calcular total corretamente
- Navegar para checkout
- Limpar carrinho

### 3. **Checkout** (Cenário MAIS Crítico)
**Justificativa:** O checkout é o momento mais crítico do e-commerce, pois é onde a venda é concretizada. Qualquer falha aqui resulta diretamente em perda de receita.

**Cenários cobertos:**
- Validação de campos obrigatórios
- Finalização de compra com dados válidos
- Validação de formato de email
- Checkout como usuário logado
- Exibição de resumo do pedido
- Alteração de quantidade no checkout

### 4. **Busca de Produtos**
**Justificativa:** A busca é essencial para que os clientes encontrem produtos rapidamente. Problemas na busca podem resultar em abandono de carrinho.

**Cenários cobertos:**
- Busca com resultados válidos
- Busca sem resultados
- Busca por nome parcial
- Navegação para produto a partir dos resultados

### 5. **Fluxo Completo E2E**
**Justificativa:** Valida a jornada completa do cliente desde a busca até a finalização da compra, garantindo que o fluxo principal de vendas funciona end-to-end.

**Cenários cobertos:**
- Fluxo completo: Busca → Produto → Carrinho → Checkout
- Fluxo completo com usuário logado

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Git

### Passos para Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositório>
cd desafio-cypress-QA
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   
   O arquivo `cypress.env.json` já está configurado com valores padrão. Você pode ajustar conforme necessário:
   
```json
{
  "baseUrl": "https://lojaebac.ebaconline.art.br",
  "userEmail": "seu-email@teste.com",
  "userPassword": "sua-senha"
}
```

## ▶️ Como Executar os Testes

### Modo Interativo (Cypress Test Runner)

Abre a interface gráfica do Cypress para executar os testes de forma interativa:

```bash
npm run cy:open
```

### Modo Headless (Linha de Comando)

Executa todos os testes em modo headless:

```bash
npm run cy:run
```

### Executar em Navegadores Específicos

```bash
# Chrome
npm run cy:run:chrome

# Firefox
npm run cy:run:firefox

# Edge
npm run cy:run:edge
```

### Executar Testes Específicos

```bash
# Executar apenas testes de login
npx cypress run --spec "cypress/e2e/login.cy.js"

# Executar apenas testes de carrinho
npx cypress run --spec "cypress/e2e/carrinho.cy.js"
```

## 📁 Estrutura do Projeto

```
desafio-cypress-QA/
│
├── cypress/
│   ├── e2e/                    # Arquivos de teste
│   │   ├── login.cy.js         # Testes de login
│   │   ├── carrinho.cy.js      # Testes de carrinho
│   │   ├── checkout.cy.js      # Testes de checkout
│   │   ├── busca.cy.js         # Testes de busca
│   │   └── fluxo-completo.cy.js # Testes E2E completos
│   │
│   ├── support/
│   │   ├── commands.js         # Commands customizados
│   │   ├── e2e.js              # Configurações globais
│   │   └── page-objects/       # Page Objects
│   │       ├── LoginPage.js
│   │       ├── HomePage.js
│   │       ├── ProductPage.js
│   │       ├── CartPage.js
│   │       ├── CheckoutPage.js
│   │       └── index.js
│   │
│   ├── fixtures/               # Dados de teste (se necessário)
│   ├── videos/                 # Vídeos dos testes (gerado automaticamente)
│   └── screenshots/            # Screenshots de falhas (gerado automaticamente)
│
├── cypress.config.js           # Configuração do Cypress
├── cypress.env.json            # Variáveis de ambiente
├── package.json                # Dependências do projeto
└── README.md                   # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Cypress** 13.6.0 - Framework de automação de testes
- **JavaScript** - Linguagem de programação
- **Page Object Pattern** - Padrão de design para organização do código
- **BDD** - Behavior Driven Development para escrita dos testes

## 📝 Commands Customizados

O projeto utiliza vários commands customizados para facilitar a manutenção e reutilização:

- `cy.login(email, password)` - Realiza login no sistema
- `cy.logout()` - Realiza logout
- `cy.addProductToCart(productName)` - Adiciona produto ao carrinho
- `cy.fillCheckoutForm(data)` - Preenche formulário de checkout
- `cy.clearCart()` - Limpa o carrinho
- `cy.shouldBeLoggedIn()` - Verifica se está logado
- `cy.navigateTo(page)` - Navega para uma página específica
- `cy.shouldShowMessage(message, type)` - Verifica mensagens de sucesso/erro
- `cy.waitForElement(selector, retries)` - Aguarda elemento com retry

## 🎨 Page Objects

O projeto utiliza Page Objects para organizar os seletores e métodos de cada página:

- **LoginPage** - Página de login/autenticação
- **HomePage** - Página inicial
- **ProductPage** - Página de detalhes do produto
- **CartPage** - Página do carrinho
- **CheckoutPage** - Página de checkout

## ⚙️ Configurações

### Timeouts

- `defaultCommandTimeout`: 10000ms (10 segundos)
- `pageLoadTimeout`: 30000ms (30 segundos)
- `requestTimeout`: 10000ms (10 segundos)

### Retry

- `runMode`: 2 retries em modo headless
- `openMode`: 0 retries no modo interativo

### Vídeos e Screenshots

- Vídeos são gravados automaticamente para todos os testes
- Screenshots são capturados automaticamente em caso de falha

## 🐛 Tratamento de Erros

O projeto inclui tratamento para erros comuns:

- Erros de JavaScript de terceiros (ex: ResizeObserver)
- Flaky tests com retry automático
- Validações robustas com múltiplas tentativas

## 📊 Relatórios

Após a execução dos testes, você encontrará:

- **Vídeos**: Em `cypress/videos/` (um vídeo por arquivo de teste)
- **Screenshots**: Em `cypress/screenshots/` (capturados em caso de falha)

## 🔧 Manutenção

### Adicionar Novos Testes

1. Crie um novo arquivo em `cypress/e2e/` seguindo o padrão `*.cy.js`
2. Importe os Page Objects necessários
3. Siga o padrão BDD (Given/When/Then)
4. Adicione comentários explicativos

### Adicionar Novos Commands

1. Adicione o command em `cypress/support/commands.js`
2. Documente o command com JSDoc
3. Inclua exemplos de uso

### Adicionar Novos Page Objects

1. Crie o arquivo em `cypress/support/page-objects/`
2. Exporte a classe ou instância
3. Adicione ao `index.js` se necessário

## 📌 Observações Importantes

- Os seletores CSS podem precisar ser ajustados conforme a estrutura real do site
- Alguns testes podem precisar de credenciais válidas configuradas em `cypress.env.json`
- Em ambiente de teste, o checkout pode não processar pagamentos reais
- Ajuste os seletores conforme a estrutura HTML real do site

## 👤 Autor

**Joabe**

Desenvolvido como parte do desafio técnico para vaga de QA Automation.

## 📄 Licença

Este projeto é privado e foi desenvolvido exclusivamente para fins de avaliação técnica.

---

**Boa sorte com os testes! 🚀**
