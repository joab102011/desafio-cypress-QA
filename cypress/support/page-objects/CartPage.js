/**
 * Page Object para a página do carrinho
 * 
 * Este arquivo contém os seletores e métodos relacionados à página do carrinho.
 */

class CartPage {
  // Seletores da página do carrinho
  get cartItems() {
    return cy.get('.cart_item, .woocommerce-cart-form__cart-item')
  }

  get removeButtons() {
    return cy.get('.remove, .product-remove a')
  }

  get updateCartButton() {
    return cy.get('button[name="update_cart"]')
  }

  get emptyCartMessage() {
    return cy.contains('Seu carrinho está vazio')
  }

  get proceedToCheckoutButton() {
    return cy.get('.checkout-button, a.checkout-button')
  }

  get cartSubtotal() {
    return cy.get('.cart-subtotal .amount, .cart-subtotal')
  }

  get cartTotal() {
    return cy.get('.order-total .amount, .order-total')
  }

  get quantityInputs() {
    return cy.get('.quantity input, input[name*="quantity"]')
  }

  /**
   * Visita a página do carrinho
   */
  visit() {
    cy.visit('/carrinho')
  }

  /**
   * Verifica se o carrinho está vazio
   */
  shouldBeEmpty() {
    this.emptyCartMessage.should('be.visible')
  }

  /**
   * Verifica se o carrinho tem itens
   * @param {number} expectedCount - Quantidade esperada de itens
   */
  shouldHaveItems(expectedCount) {
    this.cartItems.should('have.length', expectedCount)
  }

  /**
   * Remove um item do carrinho pelo índice
   * @param {number} index - Índice do item (começa em 0)
   */
  removeItem(index = 0) {
    this.removeButtons.eq(index).should('be.visible').click()
    
    // Aguardar remoção
    cy.wait(1000)
  }

  /**
   * Remove todos os itens do carrinho
   */
  clearCart() {
    cy.get('body').then(($body) => {
      if ($body.find('.remove, .product-remove a').length > 0) {
        this.removeButtons.each(() => {
          cy.get('.remove, .product-remove a').first().click()
          cy.wait(1000)
        })
      }
    })
  }

  /**
   * Atualiza a quantidade de um item
   * @param {number} index - Índice do item
   * @param {number} quantity - Nova quantidade
   */
  updateQuantity(index, quantity) {
    this.quantityInputs.eq(index).clear().type(quantity.toString())
    this.updateCartButton.should('be.visible').click()
    
    // Aguardar atualização
    cy.wait(2000)
  }

  /**
   * Clica no botão de finalizar compra
   */
  proceedToCheckout() {
    this.proceedToCheckoutButton.should('be.visible').click()
  }

  /**
   * Verifica se está na página do carrinho
   */
  shouldBeOnCartPage() {
    cy.url().should('include', '/carrinho')
  }

  /**
   * Obtém o total do carrinho
   * @returns {Cypress.Chainable} - Chainable com o total
   */
  getCartTotal() {
    return this.cartTotal.invoke('text')
  }
}

export default new CartPage()

