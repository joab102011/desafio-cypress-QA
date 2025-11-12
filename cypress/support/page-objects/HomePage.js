/**
 * Page Object para a página inicial (Home)
 * 
 * Boa prática: Centraliza seletores e ações da página inicial
 * Usa seletores múltiplos para compatibilidade com diferentes temas
 * Exporta instância única (singleton) para reutilização
 */
class HomePage {
  // Seletores usam múltiplas opções para maior robustez
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

  /**
   * Obtém a quantidade de itens no carrinho
   * Boa prática: Extrai número do texto do botão do carrinho
   * Retorna 0 se não encontrar número
   */
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

  /**
   * Navega para a página inicial
   */
  visit() {
    cy.visit('/')
  }

  /**
   * Busca um produto na página inicial
   * Boa prática: Usa encodeURIComponent para tratar caracteres especiais
   * 
   * @param {string} searchTerm - Termo de busca
   */
  searchProduct(searchTerm) {
    cy.visit(`/?s=${encodeURIComponent(searchTerm)}`)
    cy.get('body', { timeout: 5000 }).should('be.visible')
  }

  /**
   * Clica em um produto específico pelo nome
   * 
   * @param {string} productName - Nome do produto
   */
  clickProduct(productName) {
    cy.contains('a[href*="/product/"]', productName)
      .should('be.visible')
      .click()
  }

  /**
   * Valida quantidade de itens no carrinho
   * Boa prática: Implementa retry para elementos dinâmicos que podem demorar a atualizar
   * 
   * @param {number} expectedCount - Quantidade esperada de itens
   */
  shouldHaveCartItems(expectedCount) {
    cy.get('body', { timeout: 5000 }).should('be.visible')
    
    // Tenta encontrar botão do carrinho e extrair quantidade
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
      
      // Se não encontrou ou quantidade menor que esperado, tenta novamente (retry)
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

  /**
   * Clica no ícone do carrinho
   */
  clickCart() {
    this.cartIcon.should('be.visible').click()
  }

  /**
   * Navega para a página de login/minha conta
   */
  goToLogin() {
    this.myAccountLink.should('be.visible').click()
  }

  /**
   * Valida que está na página inicial
   * Verifica URL e presença do logo
   */
  shouldBeOnHomePage() {
    cy.url().should('include', Cypress.config('baseUrl'))
    this.logo.should('be.visible')
  }
}

export default new HomePage()
