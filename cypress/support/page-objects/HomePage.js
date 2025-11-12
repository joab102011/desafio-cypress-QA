/**
 * Page Object para a página inicial (Home)
 * 
 * Este arquivo contém os seletores e métodos relacionados à página inicial.
 * Seletores ajustados baseados na estrutura real do site http://lojaebac.ebaconline.art.br
 */

class HomePage {
  // Seletores da página inicial - baseados na estrutura real do site
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

  /**
   * Visita a página inicial
   */
  visit() {
    cy.visit('/')
  }

  /**
   * Busca por um produto
   * @param {string} searchTerm - Termo de busca
   */
  searchProduct(searchTerm) {
    // Como o campo de busca está em um modal que pode não estar visível,
    // vamos usar a URL de busca diretamente, que é mais confiável
    cy.visit(`/?s=${encodeURIComponent(searchTerm)}`)
    
    // Aguardar resultados carregarem
    cy.get('body', { timeout: 5000 }).should('be.visible')
  }

  /**
   * Clica em um produto específico
   * @param {string} productName - Nome do produto
   */
  clickProduct(productName) {
    cy.contains('a[href*="/product/"]', productName)
      .should('be.visible')
      .click()
  }

  /**
   * Verifica se o carrinho tem itens
   * @param {number} expectedCount - Quantidade esperada
   */
  shouldHaveCartItems(expectedCount) {
    // Aguardar que o carrinho seja atualizado e verificar o contador
    cy.get('body', { timeout: 5000 }).should('be.visible')
    
    // Procurar por botão que contém "Cart" e verificar o contador
    // O contador está no texto do botão, exemplo: "Cart : R$84,00 1"
    cy.get('button', { timeout: 5000 }).then(($buttons) => {
      let cartCount = 0
      let foundCartButton = false
      
      $buttons.each((i, btn) => {
        const text = btn.textContent || btn.innerText || ''
        // Procurar por "Cart" no texto e extrair o número no final
        if (text.includes('Cart') || text.includes('carrinho')) {
          foundCartButton = true
          // Extrair o último número do texto (que é o contador)
          const numbers = text.match(/\d+/g)
          if (numbers && numbers.length > 0) {
            // Pegar o último número (que é o contador de itens)
            cartCount = parseInt(numbers[numbers.length - 1])
            return false // break
          }
        }
      })
      
      if (!foundCartButton || cartCount < expectedCount) {
        // Se não encontrou ou contador menor, aguardar mais um pouco e tentar novamente
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
   * Navega para a página de login
   */
  goToLogin() {
    this.myAccountLink.should('be.visible').click()
  }

  /**
   * Verifica se está na página inicial
   */
  shouldBeOnHomePage() {
    cy.url().should('include', Cypress.config('baseUrl'))
    this.logo.should('be.visible')
  }
}

export default new HomePage()
