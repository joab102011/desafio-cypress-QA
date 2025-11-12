# Desafio Cypress QA

[![Cypress Tests](https://github.com/joab102011/desafio-cypress-QA/actions/workflows/cypress-tests.yml/badge.svg)](https://github.com/joab102011/desafio-cypress-QA/actions/workflows/cypress-tests.yml)
[![Cypress](https://img.shields.io/badge/Cypress-13.6.0-brightgreen)](https://www.cypress.io/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Projeto de automação de testes end-to-end (E2E) utilizando Cypress para o site **lojaebac.ebaconline.art.br**.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, seguindo as melhores práticas de automação de testes:

- ✅ Commands customizados para reutilização de código
- ✅ Page Objects bem organizados
- ✅ Padrão BDD (Given/When/Then) nos testes
- ✅ Estrutura fácil de manter e escalar
- ✅ CI/CD com GitHub Actions
- ✅ Lint e formatação automatizados
- ✅ Testes em múltiplos navegadores (Chrome, Firefox, Edge)

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
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
  "baseUrl": "http://lojaebac.ebaconline.art.br",
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

# Executar testes críticos (login + checkout)
npm run test:critical
```

### Testar Localmente Antes do Push

Para garantir que os testes passem antes de fazer push:

```bash
npm run test:local
```

Este comando executa:
- ✅ Validação de código com ESLint
- ✅ Verificação de formatação com Prettier
- ✅ Testes críticos (login e checkout)

### Lint e Formatação

```bash
# Verificar problemas de lint
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Verificar formatação
npm run format:check

# Formatar código automaticamente
npm run format
```

## 🎯 Cenários Automatizados e Justificativas

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

### 6. **Testes Negativos**

**Justificativa:** Testes negativos são essenciais para garantir robustez e segurança. Previnem quebra do sistema com dados inválidos, problemas de segurança e má experiência do usuário.

**Cenários cobertos:**
- Validações de campos obrigatórios
- Validações de formato (email, telefone, CEP)
- Proteção contra SQL Injection
- Proteção contra XSS (Cross-Site Scripting)
- Validação de limites (quantidade, tamanho de campos)
- Tratamento de tentativas múltiplas de login
- Validações de carrinho vazio
- Validações de checkout sem dados
- Tratamento de URLs inválidas
- Validação de caracteres especiais

### 7. **Testes de Performance**

**Justificativa:** Performance impacta diretamente experiência do usuário, taxa de conversão, SEO e satisfação do cliente. Estes testes garantem que o site mantenha performance adequada.

**Cenários cobertos:**
- Performance de carregamento de páginas
- Performance de renderização de elementos
- Performance de carregamento de imagens
- Performance de interações do usuário
- Performance de requisições AJAX
- Validação de recursos bloqueantes
- Performance de navegação
- Performance sob carga
- Métricas de navegador (DOM, Load Time, Server Response)

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
│   │   ├── fluxo-completo.cy.js # Testes E2E completos
│   │   ├── testes-negativos.cy.js # Testes negativos
│   │   └── performance.cy.js   # Testes de performance
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
├── .github/
│   └── workflows/              # Workflows do GitHub Actions
│       └── cypress-tests.yml    # Pipeline de testes
├── cypress.config.js           # Configuração do Cypress
├── cypress.env.json            # Variáveis de ambiente
├── .eslintrc.json              # Configuração do ESLint
├── .prettierrc.json            # Configuração do Prettier
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json                # Dependências do projeto
└── README.md                   # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Cypress** 13.6.0 - Framework de automação de testes
- **JavaScript** - Linguagem de programação
- **Page Object Pattern** - Padrão de design para organização do código
- **BDD** - Behavior Driven Development para escrita dos testes
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **GitHub Actions** - CI/CD automatizado
- **Node.js** 18+ - Runtime JavaScript

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
- `cy.step(description)` - Descreve steps BDD (Given/When/Then)

### Commands de Performance

- `cy.measurePageLoad(url, maxTime)` - Mede tempo de carregamento de página
- `cy.measureAction(action, maxTime)` - Mede tempo de resposta de uma ação
- `cy.measureElementRender(selector, maxTime)` - Mede tempo de renderização
- `cy.validatePerformanceMetrics(thresholds)` - Valida métricas de performance
- `cy.measureImageLoad(selector, maxTime)` - Mede tempo de carregamento de imagens
- `cy.measureAjaxResponse(method, url, maxTime)` - Mede tempo de resposta AJAX
- `cy.validateResourceLoadTime(maxTime)` - Valida recursos bloqueantes
- `cy.measureInteraction(clickSelector, responseSelector, maxTime)` - Mede tempo de interação

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

- `runMode`: 0 retries em modo headless (desabilitado - site tem performance estável)
- `openMode`: 0 retries no modo interativo

### Vídeos e Screenshots

- Vídeos são gravados automaticamente para todos os testes
- Screenshots são capturados automaticamente em caso de falha

## 🐛 Tratamento de Erros

O projeto inclui tratamento para erros comuns:

- Erros de JavaScript de terceiros (ex: ResizeObserver)
- Validações robustas com timeouts adequados
- Site com performance estável, sem necessidade de retry

## 📊 Relatórios

Após a execução dos testes, você encontrará:

- **Vídeos**: Em `cypress/videos/` (um vídeo por arquivo de teste)
- **Screenshots**: Em `cypress/screenshots/` (capturados em caso de falha)

### Relatórios no GitHub Actions

Os testes executados via GitHub Actions geram automaticamente:
- ✅ Artifacts com vídeos dos testes
- ✅ Screenshots em caso de falha
- ✅ Relatórios consolidados por navegador
- ✅ Status de execução visível no PR

## 🔄 CI/CD - GitHub Actions

O projeto inclui pipeline automatizado de CI/CD configurado para **execução manual sob demanda**.

### Workflow de Testes

**Arquivo:** `.github/workflows/cypress-tests.yml`

### Estratégia de CI/CD: Execução Manual

A decisão de usar execução manual ao invés de automática a cada push foi tomada considerando:

1. **Economia de Recursos e Custos** 💰
   - Evita consumo desnecessário de minutos do GitHub Actions
   - Reduz custos em projetos com muitos commits/pushes
   - Permite controle sobre quando utilizar recursos do CI/CD

2. **Testes Locais como Primeira Linha de Defesa** 🛡️
   - Testes locais são executados ANTES do push (`npm run test:local`)
   - Desenvolvedor valida código localmente antes de enviar
   - Falhas são detectadas e corrigidas localmente

3. **Execução sob Demanda para Prioridades Específicas** 🎯
   - Workflow disponível para execução manual quando necessário
   - Ideal para validações específicas e prioridades do sistema
   - Permite executar testes em momentos estratégicos

### Configuração do Workflow

O workflow está configurado com:

1. **Execução Manual Apenas**
   - Disparado apenas via `workflow_dispatch` (interface do GitHub)
   - Não executa automaticamente em push
   - Controle total sobre quando executar

2. **Testes no Navegador Padrão**
   - Utiliza o navegador padrão do Cypress (Electron)
   - Execução mais rápida e eficiente
   - Suficiente para validação de funcionalidades

3. **Validação de Qualidade de Código**
   - ESLint executado antes dos testes
   - Garante que código segue padrões estabelecidos
   - Mantém consistência do código

4. **Retry Desabilitado**
   - Retry desabilitado no `cypress.config.js` (0 retries)
   - Site tem performance estável, não há necessidade de retry
   - Testes executam uma única vez, mais rápido e direto

5. **Artifacts para Debug**
   - Vídeos dos testes sempre disponíveis
   - Screenshots em caso de falha
   - Facilita identificação e correção de problemas

### Como Executar o Workflow Manualmente

1. Acesse a aba **"Actions"** no repositório GitHub
2. Selecione o workflow **"Cypress Tests - CI/CD"**
3. Clique em **"Run workflow"**
4. Selecione a branch (geralmente `main`)
5. Clique em **"Run workflow"** novamente

O workflow executará todos os testes e você poderá acompanhar o progresso em tempo real.

### Quando Usar o Workflow Manual

Recomenda-se executar o workflow manualmente em situações como:

- 🎯 **Antes de releases importantes**
- 🎯 **Antes de merges críticos**
- 🎯 **Validações periódicas do sistema**
- 🎯 **Após mudanças significativas no código**
- 🎯 **Validações de regressão**
- 🎯 **Testes de integração completos**

### Status dos Testes

Você pode verificar o status dos testes através dos badges no topo do README ou acessando a aba "Actions" do repositório.

## 🔧 Manutenção

### Adicionar Novos Testes

1. Crie um novo arquivo em `cypress/e2e/` seguindo o padrão `*.cy.js`
2. Importe os Page Objects necessários
3. Siga o padrão BDD (Given/When/Then)

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

**Joab Alexandre da Cruz**

Desenvolvido como parte do desafio técnico para vaga de QA Automation.

## 📄 Licença

Este projeto é privado e foi desenvolvido exclusivamente para fins de avaliação técnica.
