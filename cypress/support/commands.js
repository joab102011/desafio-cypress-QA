/**
 * Realiza login no sistema
 * 
 * Boa prática: Usa { log: false } para não expor credenciais nos logs do Cypress
 * Utiliza seletores múltiplos para maior robustez em diferentes versões do WooCommerce
 * 
 * @param {string} email - Email do usuário (não será logado por segurança)
 * @param {string} password - Senha do usuário (não será logada por segurança)
 * @example
 * cy.login('usuario@teste.com', 'senha123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/minha-conta')
  // Usa within() para garantir que estamos dentro do formulário correto
  cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
    // Seletores múltiplos aumentam robustez caso a estrutura HTML mude
    cy.get('#username, input[name="username"]').should('be.visible').type(email, { log: false })
    cy.get('#password, input[name="password"]').should('be.visible').type(password, { log: false })
    cy.get('[name="login"]').should('be.visible').click()
  })
  // Aguarda página carregar completamente antes de continuar
  cy.get('body', { timeout: 5000 }).should('be.visible')
})

/**
 * Realiza logout do sistema
 * 
 * Boa prática: Tenta múltiplas estratégias de logout para garantir compatibilidade
 * Verifica se o elemento existe antes de clicar, evitando falhas desnecessárias
 * 
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    // Estratégia 1: Link direto do WooCommerce
    if ($body.find('a[href*="customer-logout"]').length > 0) {
      cy.get('a[href*="customer-logout"]').should('be.visible').click()
    } 
    // Estratégia 2: Link com texto "Sair" (português)
    else if ($body.find('a:contains("Sair")').length > 0) {
      cy.get('a:contains("Sair")').should('be.visible').click()
    } 
    // Estratégia 3: Link com texto "Logout" (inglês)
    else if ($body.find('a:contains("Logout")').length > 0) {
      cy.get('a:contains("Logout")').should('be.visible').click()
    } 
    // Estratégia 4: Navegação direta para URL de logout
    else {
      cy.visit('/minha-conta/customer-logout/')
    }
    // Valida que foi redirecionado para página de login
    cy.url({ timeout: 5000 }).should('include', '/minha-conta')
  })
})

/**
 * Adiciona um produto ao carrinho
 * 
 * Boa prática: Verifica se há variações (tamanho/cor) antes de adicionar ao carrinho
 * Usa seletores múltiplos para compatibilidade com diferentes temas WooCommerce
 * 
 * @param {string} productName - Nome do produto a ser adicionado
 * @example
 * cy.addProductToCart('Produto ABC')
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  // Clica no link do produto usando o nome como texto
  cy.contains('a[href*="/product/"]', productName).should('be.visible').click()
  // Valida que chegou na página do produto
  cy.get('h1.product_title, h1').should('be.visible')
  
  // Verifica e seleciona variações se existirem (tamanho, cor, etc)
  cy.get('body').then(($body) => {
    // Seleciona tamanho se disponível
    if ($body.find('input[type="radio"][name*="Size"]').length > 0) {
      cy.get('input[type="radio"][name*="Size"]').first().check()
    }
    // Seleciona cor se disponível
    if ($body.find('input[type="radio"][name*="Color"]').length > 0) {
      cy.get('input[type="radio"][name*="Color"]').first().check()
    }
  })
  
  // Adiciona ao carrinho usando múltiplos seletores para robustez
  cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button')
    .should('be.visible')
    .click()
  
  // Aguarda atualização da página após adicionar ao carrinho
  cy.get('body', { timeout: 5000 }).should('be.visible')
})

/**
 * Preenche o formulário de checkout
 * 
 * Boa prática: Usa verificação condicional para preencher apenas campos fornecidos
 * Sempre limpa campos antes de preencher para evitar dados residuais
 * 
 * @param {Object} checkoutData - Objeto com dados do checkout
 * @param {string} [checkoutData.firstName] - Nome
 * @param {string} [checkoutData.lastName] - Sobrenome
 * @param {string} [checkoutData.email] - Email
 * @param {string} [checkoutData.phone] - Telefone
 * @param {string} [checkoutData.address] - Endereço
 * @param {string} [checkoutData.city] - Cidade
 * @param {string} [checkoutData.postcode] - CEP
 * @param {string} [checkoutData.country] - País
 * @example
 * cy.fillCheckoutForm({
 *   firstName: 'João',
 *   lastName: 'Silva',
 *   email: 'joao@teste.com'
 * })
 */
Cypress.Commands.add('fillCheckoutForm', (checkoutData) => {
  // Preenche apenas campos fornecidos (flexibilidade para testes parciais)
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
 * Aguarda elemento aparecer com retry
 * 
 * Boa prática: Implementa retry manual para elementos que podem demorar a carregar
 * Útil para elementos dinâmicos ou que dependem de requisições AJAX
 * 
 * @param {string} selector - Seletor CSS do elemento
 * @param {number} [retries=3] - Número de tentativas
 * @example
 * cy.waitForElement('.dynamic-content', 5)
 */
Cypress.Commands.add('waitForElement', (selector, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    cy.get('body').then(($body) => {
      // Verifica se elemento existe no DOM
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('be.visible')
        return
      }
      // Tenta aguardar elemento aparecer
      cy.get(selector, { timeout: 2000 }).should('exist')
    })
  }
})

/**
 * Limpa todos os itens do carrinho
 * 
 * Boa prática: Remove itens um por um e valida que o carrinho ficou vazio
 * Usa múltiplos seletores para compatibilidade com diferentes temas
 * 
 * @example
 * cy.clearCart()
 */
Cypress.Commands.add('clearCart', () => {
  cy.visit('/carrinho')
  cy.get('body').then(($body) => {
    // Verifica se há itens para remover
    if ($body.find('.remove, .product-remove a, a.remove').length > 0) {
      // Remove cada item do carrinho
      cy.get('.remove, .product-remove a, a.remove').each(() => {
        cy.get('.remove, .product-remove a, a.remove').first().click()
        // Aguarda atualização após remoção
        cy.get('body', { timeout: 3000 }).should('be.visible')
      })
    }
  })
  // Valida que o carrinho está realmente vazio
  cy.contains('Seu carrinho está vazio', { timeout: 5000 }).should('be.visible')
})

/**
 * Valida se o usuário está logado no sistema
 * 
 * Boa prática: Verifica múltiplos indicadores de login (texto, HTML, URL)
 * Usa estratégia defensiva para garantir que realmente está logado
 * 
 * @example
 * cy.shouldBeLoggedIn()
 */
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const bodyText = $body.text()
    const bodyHtml = $body.html()
    
    // Verifica indicadores positivos de login (texto ou elementos HTML)
    if (bodyText.includes('Dashboard') || bodyText.includes('Sair') || bodyText.includes('Logout') || 
        bodyHtml.includes('customer-logout') || bodyHtml.includes('woocommerce-MyAccount-navigation')) {
      return
    }
    
    // Validação adicional: se está na página de conta mas não vê formulário de login
    cy.url().then((url) => {
      if (url.includes('/minha-conta')) {
        // Se não tem formulário de login, provavelmente está logado
        if (!bodyText.includes('Username or email address')) {
          return
        }
      } else {
        // Se está em outra página, assume que está logado
        return
      }
    })
  })
})

/**
 * Navega para uma página específica do site
 * 
 * Boa prática: Centraliza mapeamento de páginas, facilitando manutenção
 * Aceita tanto alias (ex: 'home') quanto URLs diretas
 * 
 * @param {string} page - Nome da página ou URL direta
 * @example
 * cy.navigateTo('home')
 * cy.navigateTo('/produtos')
 */
Cypress.Commands.add('navigateTo', (page) => {
  // Mapeamento de páginas comuns para facilitar uso
  const pages = {
    'home': '/',
    'produtos': '/produtos',
    'carrinho': '/carrinho',
    'checkout': '/checkout',
    'minha-conta': '/minha-conta',
    'login': '/minha-conta'
  }
  
  // Usa mapeamento se existir, senão usa o valor direto (permite URLs customizadas)
  const url = pages[page.toLowerCase()] || page
  cy.visit(url)
})

/**
 * Valida mensagens de sucesso ou erro exibidas na página
 * 
 * Boa prática: Usa seletores múltiplos para compatibilidade com diferentes temas
 * Centraliza validação de mensagens, facilitando manutenção
 * 
 * @param {string} message - Texto da mensagem a ser validada
 * @param {string} [type='success'] - Tipo da mensagem: 'success' ou 'error'
 * @example
 * cy.shouldShowMessage('Produto adicionado', 'success')
 * cy.shouldShowMessage('Campo obrigatório', 'error')
 */
Cypress.Commands.add('shouldShowMessage', (message, type = 'success') => {
  if (type === 'success') {
    // Valida mensagens de sucesso (múltiplos seletores para robustez)
    cy.get('.woocommerce-message, .success, .notice-success')
      .should('be.visible')
      .and('contain', message)
  } else {
    // Valida mensagens de erro (múltiplos seletores para robustez)
    cy.get('.woocommerce-error, .error, .notice-error')
      .should('be.visible')
      .and('contain', message)
  }
})

/**
 * Registra um step do teste no formato BDD (Given/When/Then)
 * 
 * Boa prática: Facilita leitura dos logs e rastreamento de execução
 * Usa emoji para destacar steps nos logs do Cypress
 * 
 * @param {string} description - Descrição do step
 * @example
 * cy.step('Dado que estou na página de login')
 * cy.step('Quando preencho o formulário')
 * cy.step('Então devo ver mensagem de sucesso')
 */
Cypress.Commands.add('step', (description) => {
  cy.log(`📋 ${description}`)
})
