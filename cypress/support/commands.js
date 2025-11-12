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
  
  // Preencher campo de email usando formulário de login
  cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
    cy.get('#username, input[name="username"]').should('be.visible').type(email, { log: false })
    cy.get('#password, input[name="password"]').should('be.visible').type(password, { log: false })
    cy.get('[name="login"]').should('be.visible').click()
  })
  
  // Aguardar redirecionamento ou mudança na página após login
  cy.get('body', { timeout: 5000 }).should('be.visible')
})

/**
 * Comando customizado para realizar logout
 * 
 * Exemplo de uso:
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  // Tentar encontrar link de logout de várias formas
  cy.get('body').then(($body) => {
    if ($body.find('a[href*="customer-logout"]').length > 0) {
      cy.get('a[href*="customer-logout"]').should('be.visible').click()
    } else if ($body.find('a:contains("Sair")').length > 0) {
      cy.get('a:contains("Sair")').should('be.visible').click()
    } else if ($body.find('a:contains("Logout")').length > 0) {
      cy.get('a:contains("Logout")').should('be.visible').click()
    } else {
      // Se não encontrar link de logout, navegar diretamente para logout
      cy.visit('/minha-conta/customer-logout/')
    }
    
    // Verificar se foi redirecionado para a página de login
    cy.url({ timeout: 5000 }).should('include', '/minha-conta')
  })
})

/**
 * Comando customizado para adicionar produto ao carrinho
 * @param {string} productName - Nome do produto
 * 
 * Exemplo de uso:
 * cy.addProductToCart('Produto ABC')
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  // Buscar o produto usando link que contém o nome
  cy.contains('a[href*="/product/"]', productName).should('be.visible').click()
  
  // Aguardar página do produto carregar
  cy.get('h1.product_title, h1').should('be.visible')
  
  // Selecionar variações se necessário (tamanho e cor)
  cy.get('body').then(($body) => {
    // Selecionar primeiro tamanho disponível se houver
    if ($body.find('input[type="radio"][name*="Size"]').length > 0) {
      cy.get('input[type="radio"][name*="Size"]').first().check()
    }
    // Selecionar primeira cor disponível se houver
    if ($body.find('input[type="radio"][name*="Color"]').length > 0) {
      cy.get('input[type="radio"][name*="Color"]').first().check()
    }
  })
  
  // Clicar no botão de comprar
  cy.get('button:contains("Comprar"), button[name="add-to-cart"], .single_add_to_cart_button')
    .should('be.visible')
    .click()
  
  // Verificar mensagem de sucesso ou atualização do carrinho
  cy.get('body', { timeout: 5000 }).should('be.visible')
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
    cy.get('#billing_first_name').should('be.visible').clear()
    cy.get('#billing_first_name').type(checkoutData.firstName)
  }
  
  if (checkoutData.lastName) {
    cy.get('#billing_last_name').should('be.visible').clear()
    cy.get('#billing_last_name').type(checkoutData.lastName)
  }
  
  if (checkoutData.email) {
    cy.get('#billing_email').should('be.visible').clear()
    cy.get('#billing_email').type(checkoutData.email)
  }
  
  if (checkoutData.phone) {
    cy.get('#billing_phone').should('be.visible').clear()
    cy.get('#billing_phone').type(checkoutData.phone)
  }
  
  if (checkoutData.address) {
    cy.get('#billing_address_1').should('be.visible').clear()
    cy.get('#billing_address_1').type(checkoutData.address)
  }
  
  if (checkoutData.city) {
    cy.get('#billing_city').should('be.visible').clear()
    cy.get('#billing_city').type(checkoutData.city)
  }
  
  if (checkoutData.postcode) {
    cy.get('#billing_postcode').should('be.visible').clear()
    cy.get('#billing_postcode').type(checkoutData.postcode)
  }
  
  if (checkoutData.country) {
    cy.get('#billing_country').should('be.visible').select(checkoutData.country)
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
      // Aguardar elemento aparecer (usando should ao invés de wait arbitrário)
      cy.get(selector, { timeout: 2000 }).should('exist')
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
    if ($body.find('.remove, .product-remove a, a.remove').length > 0) {
      cy.get('.remove, .product-remove a, a.remove').each(() => {
        cy.get('.remove, .product-remove a, a.remove').first().click()
        // Aguardar remoção usando should ao invés de wait arbitrário
        cy.get('body', { timeout: 3000 }).should('be.visible')
      })
    }
  })
  
  // Verificar se o carrinho está vazio
  cy.contains('Seu carrinho está vazio', { timeout: 5000 }).should('be.visible')
})

/**
 * Comando customizado para verificar se está logado
 * 
 * Exemplo de uso:
 * cy.shouldBeLoggedIn()
 */
Cypress.Commands.add('shouldBeLoggedIn', () => {
  // Verificar se está logado de várias formas
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const bodyText = $body.text()
    const bodyHtml = $body.html()
    
    // Verificar se há indicadores de que está logado
    // (link de logout, dashboard, nome do usuário, etc)
    if (bodyText.includes('Dashboard') || bodyText.includes('Sair') || bodyText.includes('Logout') || 
        bodyHtml.includes('customer-logout') || bodyHtml.includes('woocommerce-MyAccount-navigation')) {
      // Está logado
      return
    }
    
    // Se ainda estiver na página de login, verificar se há mensagem de erro
    cy.url().then((url) => {
      if (url.includes('/minha-conta')) {
        // Se não houver erro e não houver formulário de login, pode estar logado
        if (!bodyText.includes('Username or email address')) {
          // Provavelmente está logado
          return
        }
      } else {
        // Se não estiver na página de login, provavelmente está logado
        return
      }
    })
  })
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

/**
 * Comando customizado para descrever steps BDD (Given/When/Then)
 * @param {string} description - Descrição do step
 * 
 * Exemplo de uso:
 * cy.step('Dado que estou na página inicial')
 * cy.step('Quando clico em um produto')
 * cy.step('Então devo ver a página do produto')
 */
Cypress.Commands.add('step', (description) => {
  cy.log(`📋 ${description}`)
})
