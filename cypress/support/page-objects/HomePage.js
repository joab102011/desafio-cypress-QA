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
    this.searchField.should('be.visible').type(searchTerm)
    this.searchButton.should('be.visible').click()
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
    cy.get('button:contains("Cart")').should(($btn) => {
      const text = $btn.text()
      const match = text.match(/(\d+)/)
      const count = match ? parseInt(match[1]) : 0
      expect(count).to.equal(expectedCount)
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
