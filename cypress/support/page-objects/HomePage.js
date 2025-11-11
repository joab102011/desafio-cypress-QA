/**
 * Page Object para a página inicial (Home)
 * 
 * Este arquivo contém os seletores e métodos relacionados à página inicial.
 */

class HomePage {
  // Seletores da página inicial
  get logo() {
    return cy.get('.site-logo, .logo')
  }

  get searchField() {
    return cy.get('.search-field, #search-field')
  }

  get searchButton() {
    return cy.get('.search-submit, button[type="submit"]')
  }

  get cartIcon() {
    return cy.get('.cart-icon, .cart-contents')
  }

  get cartCount() {
    return cy.get('.cart-count, .cart-contents-count')
  }

  get menuItems() {
    return cy.get('.menu-item, .nav-menu li')
  }

  get products() {
    return cy.get('.product, .woocommerce-loop-product__link')
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
    cy.contains('.product, .woocommerce-loop-product__link', productName)
      .should('be.visible')
      .click()
  }

  /**
   * Verifica se o carrinho tem itens
   * @param {number} expectedCount - Quantidade esperada
   */
  shouldHaveCartItems(expectedCount) {
    if (expectedCount > 0) {
      this.cartCount.should('be.visible').and('contain', expectedCount)
    } else {
      this.cartCount.should('not.exist')
    }
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
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
    this.logo.should('be.visible')
  }
}

export default new HomePage()

