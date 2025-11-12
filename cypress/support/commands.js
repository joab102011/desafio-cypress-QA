Cypress.Commands.add('login', (email, password) => {
  cy.visit('/minha-conta')
  cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
    cy.get('#username, input[name="username"]').should('be.visible').type(email, { log: false })
    cy.get('#password, input[name="password"]').should('be.visible').type(password, { log: false })
    cy.get('[name="login"]').should('be.visible').click()
  })
  cy.get('body', { timeout: 5000 }).should('be.visible')
})

Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    if ($body.find('a[href*="customer-logout"]').length > 0) {
      cy.get('a[href*="customer-logout"]').should('be.visible').click()
    } else if ($body.find('a:contains("Sair")').length > 0) {
      cy.get('a:contains("Sair")').should('be.visible').click()
    } else if ($body.find('a:contains("Logout")').length > 0) {
      cy.get('a:contains("Logout")').should('be.visible').click()
    } else {
      cy.visit('/minha-conta/customer-logout/')
    }
    cy.url({ timeout: 5000 }).should('include', '/minha-conta')
  })
})

Cypress.Commands.add('addProductToCart', (productName) => {
  cy.contains('a[href*="/product/"]', productName).should('be.visible').click()
  cy.get('h1.product_title, h1').should('be.visible')
  
  cy.get('body').then(($body) => {
    if ($body.find('input[type="radio"][name*="Size"]').length > 0) {
      cy.get('input[type="radio"][name*="Size"]').first().check()
    }
    if ($body.find('input[type="radio"][name*="Color"]').length > 0) {
      cy.get('input[type="radio"][name*="Color"]').first().check()
    }
  })
  
  cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button')
    .should('be.visible')
    .click()
  
  cy.get('body', { timeout: 5000 }).should('be.visible')
})

Cypress.Commands.add('fillCheckoutForm', (checkoutData) => {
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

Cypress.Commands.add('waitForElement', (selector, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('be.visible')
        return
      }
      cy.get(selector, { timeout: 2000 }).should('exist')
    })
  }
})

Cypress.Commands.add('clearCart', () => {
  cy.visit('/carrinho')
  cy.get('body').then(($body) => {
    if ($body.find('.remove, .product-remove a, a.remove').length > 0) {
      cy.get('.remove, .product-remove a, a.remove').each(() => {
        cy.get('.remove, .product-remove a, a.remove').first().click()
        cy.get('body', { timeout: 3000 }).should('be.visible')
      })
    }
  })
  cy.contains('Seu carrinho está vazio', { timeout: 5000 }).should('be.visible')
})

Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const bodyText = $body.text()
    const bodyHtml = $body.html()
    
    if (bodyText.includes('Dashboard') || bodyText.includes('Sair') || bodyText.includes('Logout') || 
        bodyHtml.includes('customer-logout') || bodyHtml.includes('woocommerce-MyAccount-navigation')) {
      return
    }
    
    cy.url().then((url) => {
      if (url.includes('/minha-conta')) {
        if (!bodyText.includes('Username or email address')) {
          return
        }
      } else {
        return
      }
    })
  })
})

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

Cypress.Commands.add('step', (description) => {
  cy.log(`📋 ${description}`)
})
