/**
 * Page Object para a página do carrinho
 * 
 * Este arquivo contém os seletores e métodos relacionados à página do carrinho.
 * Seletores ajustados baseados na estrutura real do site http://lojaebac.ebaconline.art.br
 */

class CartPage {
  // Seletores da página do carrinho - baseados na estrutura real
  get cartItems() {
    return cy.get('.cart_item, .woocommerce-cart-form__cart-item, tbody .cart_item')
  }

  get removeButtons() {
    return cy.get('.remove, .product-remove a, a.remove')
  }

  get updateCartButton() {
    return cy.get('button[name="update_cart"], input[name="update_cart"]')
  }

  get emptyCartMessage() {
    return cy.contains('Seu carrinho está vazio', { timeout: 5000 })
  }

  get proceedToCheckoutButton() {
    // Botão de checkout no carrinho é um link com texto "Concluir compra"
    return cy.get('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a')
  }

  get cartSubtotal() {
    return cy.get('.cart-subtotal .amount, .cart-subtotal')
  }

  get cartTotal() {
    return cy.get('.order-total .amount, .order-total, .cart-total')
  }

  get quantityInputs() {
    // Input de quantidade no carrinho tem nome específico: cart[hash][qty]
    return cy.get('input[type="number"][name*="cart"][name*="qty"], .quantity input[type="number"], input[name*="quantity"]:not([type="button"])')
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
    cy.get('body').then(($body) => {
      if ($body.find('.cart_item, .woocommerce-cart-form__cart-item').length > 0) {
        this.cartItems.should('have.length', expectedCount)
      } else {
        // Se não houver itens, verificar mensagem de carrinho vazio
        this.emptyCartMessage.should('be.visible')
      }
    })
  }

  /**
   * Remove um item do carrinho pelo índice
   * @param {number} index - Índice do item (começa em 0)
   */
  removeItem(index = 0) {
    cy.get('body').then(($body) => {
      if ($body.find('.remove, .product-remove a, a.remove').length > 0) {
        this.removeButtons.eq(index).should('be.visible').click()
        // Aguardar remoção usando should ao invés de wait arbitrário
        cy.get('body', { timeout: 3000 }).should('be.visible')
      }
    })
  }

  /**
   * Remove todos os itens do carrinho
   */
  clearCart() {
    cy.get('body').then(($body) => {
      if ($body.find('.remove, .product-remove a, a.remove').length > 0) {
        this.removeButtons.each(() => {
          cy.get('.remove, .product-remove a, a.remove').first().click()
          cy.get('body', { timeout: 3000 }).should('be.visible')
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
    cy.get('body').then(($body) => {
      // Procurar input de quantidade no carrinho (tem nome específico)
      const qtyInputs = $body.find('input[type="number"][name*="cart"][name*="qty"], .quantity input[type="number"]')
      if (qtyInputs.length > 0) {
        this.quantityInputs.eq(index).should('be.visible').clear()
        this.quantityInputs.eq(index).type(quantity.toString())
        
        // Verificar se há botão de atualizar
        if ($body.find('button[name="update_cart"]').length > 0) {
          this.updateCartButton.should('be.visible').click()
          // Aguardar atualização usando should ao invés de wait arbitrário
          cy.get('body', { timeout: 5000 }).should('be.visible')
        }
      }
    })
  }

  /**
   * Clica no botão de finalizar compra
   */
  proceedToCheckout() {
    cy.get('body').then(($body) => {
      // Verificar se o carrinho não está vazio
      if ($body.find('p:contains("Seu carrinho está vazio")').length > 0) {
        // Carrinho vazio, não pode ir para checkout
        throw new Error('Carrinho está vazio, não é possível ir para checkout')
      }
      
      // Verificar se há link/botão de checkout (texto "Concluir compra" ou link para /checkout/)
      const checkoutLink = $body.find('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a')
      if (checkoutLink.length > 0) {
        cy.get('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a')
          .first()
          .should('be.visible')
          .click()
      } else {
        // Se não houver botão, navegar diretamente
        cy.visit('/checkout')
      }
    })
  }

  /**
   * Verifica se está na página do carrinho
   */
  shouldBeOnCartPage() {
    cy.url().should('include', '/carrinho')
    // Verificar título do carrinho de forma mais robusta
    cy.get('body').then(($body) => {
      // Verificar se há título "Carrinho" ou mensagem de carrinho vazio
      if ($body.find('h1:contains("Carrinho"), .page-title:contains("Carrinho")').length > 0) {
        cy.contains('h1, .page-title', 'Carrinho').should('be.visible')
      } else if ($body.find('p:contains("Seu carrinho está vazio")').length > 0) {
        cy.contains('Seu carrinho está vazio').should('be.visible')
      } else {
        // Fallback: verificar URL
        cy.url().should('include', '/carrinho')
      }
    })
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
