// ***********************************************************
// Comandos Customizados do Cypress
// 
// Este arquivo contém comandos reutilizáveis que podem ser usados
// em múltiplos testes, seguindo a recomendação do entrevistador
// de usar bastante Commands para evitar código básico.
// ***********************************************************

/**
 * Comando customizado para realizar login no sistema
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * 
 * Exemplo de uso:
 * cy.login('usuario@teste.com', 'senha123')
 */
Cypress.Commands.add('login', (email, password) => {
  // Visitar a página de login
  cy.visit('/minha-conta')
  
  // Preencher campo de email
  cy.get('#username').should('be.visible').type(email, { log: false })
  
  // Preencher campo de senha
  cy.get('#password').should('be.visible').type(password, { log: false })
  
  // Clicar no botão de login
  cy.get('[name="login"]').should('be.visible').click()
  
  // Aguardar redirecionamento após login
  cy.url().should('not.include', '/minha-conta')
})

/**
 * Comando customizado para realizar logout
 * 
 * Exemplo de uso:
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  // Clicar no link de logout (ajustar seletor conforme necessário)
  cy.get('a[href*="customer-logout"]').should('be.visible').click()
  
  // Verificar se foi redirecionado para a página de login
  cy.url().should('include', '/minha-conta')
})

/**
 * Comando customizado para adicionar produto ao carrinho
 * @param {string} productName - Nome do produto
 * 
 * Exemplo de uso:
 * cy.addProductToCart('Produto ABC')
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  // Buscar o produto
  cy.get('.product').contains(productName).click()
  
  // Aguardar página do produto carregar
  cy.get('.product_title').should('be.visible')
  
  // Clicar no botão de adicionar ao carrinho
  cy.get('button[name="add-to-cart"]').should('be.visible').click()
  
  // Verificar mensagem de sucesso
  cy.get('.woocommerce-message').should('be.visible')
})

/**
 * Comando customizado para preencher formulário de checkout
 * @param {object} checkoutData - Objeto com dados do checkout
 * 
 * Exemplo de uso:
 * cy.fillCheckoutForm({
 *   firstName: 'João',
 *   lastName: 'Silva',
 *   email: 'joao@teste.com',
 *   phone: '11999999999',
 *   address: 'Rua Teste, 123',
 *   city: 'São Paulo',
 *   postcode: '01234-567',
 *   country: 'Brasil'
 * })
 */
Cypress.Commands.add('fillCheckoutForm', (checkoutData) => {
  // Preencher dados de cobrança
  if (checkoutData.firstName) {
    cy.get('#billing_first_name').clear().type(checkoutData.firstName)
  }
  
  if (checkoutData.lastName) {
    cy.get('#billing_last_name').clear().type(checkoutData.lastName)
  }
  
  if (checkoutData.email) {
    cy.get('#billing_email').clear().type(checkoutData.email)
  }
  
  if (checkoutData.phone) {
    cy.get('#billing_phone').clear().type(checkoutData.phone)
  }
  
  if (checkoutData.address) {
    cy.get('#billing_address_1').clear().type(checkoutData.address)
  }
  
  if (checkoutData.city) {
    cy.get('#billing_city').clear().type(checkoutData.city)
  }
  
  if (checkoutData.postcode) {
    cy.get('#billing_postcode').clear().type(checkoutData.postcode)
  }
  
  if (checkoutData.country) {
    cy.get('#billing_country').select(checkoutData.country)
  }
})

/**
 * Comando customizado para aguardar elemento com retry
 * Útil para evitar flaky tests conforme mencionado na entrevista
 * @param {string} selector - Seletor do elemento
 * @param {number} retries - Número de tentativas (padrão: 3)
 * 
 * Exemplo de uso:
 * cy.waitForElement('.product-title', 3)
 */
Cypress.Commands.add('waitForElement', (selector, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('be.visible')
        return
      }
      // Aguardar um pouco antes de tentar novamente
      cy.wait(1000)
    })
  }
})

/**
 * Comando customizado para limpar carrinho
 * 
 * Exemplo de uso:
 * cy.clearCart()
 */
Cypress.Commands.add('clearCart', () => {
  cy.visit('/carrinho')
  
  // Remover todos os itens do carrinho
  cy.get('body').then(($body) => {
    if ($body.find('.remove').length > 0) {
      cy.get('.remove').each(($el) => {
        cy.wrap($el).click()
        cy.wait(1000) // Aguardar remoção
      })
    }
  })
  
  // Verificar se o carrinho está vazio
  cy.contains('Seu carrinho está vazio').should('be.visible')
})

/**
 * Comando customizado para verificar se está logado
 * 
 * Exemplo de uso:
 * cy.shouldBeLoggedIn()
 */
Cypress.Commands.add('shouldBeLoggedIn', () => {
  // Verificar se existe link de logout ou nome do usuário
  cy.get('body').should('not.contain', 'Login')
  cy.url().should('not.include', '/minha-conta')
})

/**
 * Comando customizado para navegar para uma página específica
 * @param {string} page - Nome da página ou URL
 * 
 * Exemplo de uso:
 * cy.navigateTo('produtos')
 */
Cypress.Commands.add('navigateTo', (page) => {
  const pages = {
    'home': '/',
    'produtos': '/produtos',
    'carrinho': '/carrinho',
    'checkout': '/checkout',
    'minha-conta': '/minha-conta',
    'login': '/minha-conta'
  }
  
  const url = pages[page.toLowerCase()] || page
  cy.visit(url)
})

/**
 * Comando customizado para verificar mensagem de sucesso/erro
 * @param {string} message - Mensagem esperada
 * @param {string} type - Tipo da mensagem ('success' ou 'error')
 * 
 * Exemplo de uso:
 * cy.shouldShowMessage('Produto adicionado ao carrinho', 'success')
 */
Cypress.Commands.add('shouldShowMessage', (message, type = 'success') => {
  if (type === 'success') {
    cy.get('.woocommerce-message, .success, .notice-success')
      .should('be.visible')
      .and('contain', message)
  } else {
    cy.get('.woocommerce-error, .error, .notice-error')
      .should('be.visible')
      .and('contain', message)
  }
})

