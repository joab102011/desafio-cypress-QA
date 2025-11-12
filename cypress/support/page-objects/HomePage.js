class HomePage {
  get logo() {
    return cy.get('a[href*="/"] img[alt*="EBAC"], .site-logo')
  }

  get searchField() {
    return cy.get('input[placeholder*="Enter your search"], input[type="search"], input[name*="search"]')
  }

  get searchButton() {
    return cy.get('button:contains("Search"), button[type="submit"]').first()
  }

  get cartIcon() {
    return cy.get('button:contains("Cart"), .cart-contents')
  }

  get cartCount() {
    return cy.get('button:contains("Cart")').then(($btn) => {
      const text = $btn.text()
      const match = text.match(/(\d+)/)
      return match ? cy.wrap(parseInt(match[1])) : cy.wrap(0)
    })
  }

  get products() {
    return cy.get('a[href*="/product/"], .product, .woocommerce-loop-product__link')
  }

  get myAccountLink() {
    return cy.get('a[href*="minha-conta"]')
  }

  visit() {
    cy.visit('/')
  }

  searchProduct(searchTerm) {
    cy.visit(`/?s=${encodeURIComponent(searchTerm)}`)
    cy.get('body', { timeout: 5000 }).should('be.visible')
  }

  clickProduct(productName) {
    cy.contains('a[href*="/product/"]', productName)
      .should('be.visible')
      .click()
  }

  shouldHaveCartItems(expectedCount) {
    cy.get('body', { timeout: 5000 }).should('be.visible')
    
    cy.get('button', { timeout: 5000 }).then(($buttons) => {
      let cartCount = 0
      let foundCartButton = false
      
      $buttons.each((i, btn) => {
        const text = btn.textContent || btn.innerText || ''
        if (text.includes('Cart') || text.includes('carrinho')) {
          foundCartButton = true
          const numbers = text.match(/\d+/g)
          if (numbers && numbers.length > 0) {
            cartCount = parseInt(numbers[numbers.length - 1])
            return false
          }
        }
      })
      
      if (!foundCartButton || cartCount < expectedCount) {
        cy.get('body', { timeout: 3000 }).should('be.visible')
        cy.get('button', { timeout: 3000 }).then(($btns) => {
          let finalCount = 0
          $btns.each((i, btn) => {
            const text = btn.textContent || btn.innerText || ''
            if (text.includes('Cart') || text.includes('carrinho')) {
              const numbers = text.match(/\d+/g)
              if (numbers && numbers.length > 0) {
                finalCount = parseInt(numbers[numbers.length - 1])
                return false
              }
            }
          })
          expect(finalCount).to.be.at.least(expectedCount)
        })
      } else {
        expect(cartCount).to.be.at.least(expectedCount)
      }
    })
  }

  clickCart() {
    this.cartIcon.should('be.visible').click()
  }

  goToLogin() {
    this.myAccountLink.should('be.visible').click()
  }

  shouldBeOnHomePage() {
    cy.url().should('include', Cypress.config('baseUrl'))
    this.logo.should('be.visible')
  }
}

export default new HomePage()
