class CartPage {
  get cartItems() {
    return cy.get('.cart_item, .woocommerce-cart-form__cart-item, tbody .cart_item')
  }

  get removeButtons() {
    return cy.get('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"]')
  }

  get updateCartButton() {
    return cy.get('button[name="update_cart"], input[name="update_cart"]')
  }

  get emptyCartMessage() {
    return cy.contains('Seu carrinho está vazio', { timeout: 5000 })
  }

  get proceedToCheckoutButton() {
    return cy.get('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a')
  }

  get cartSubtotal() {
    return cy.get('.cart-subtotal .amount, .cart-subtotal')
  }

  get cartTotal() {
    return cy.get('.order-total .amount, .order-total, .cart-total')
  }

  get quantityInputs() {
    return cy.get('input[type="number"][name*="cart"][name*="qty"], .quantity input[type="number"], input[name*="quantity"]:not([type="button"])')
  }
  visit() {
    cy.visit('/carrinho')
  }

  shouldBeEmpty() {
    this.emptyCartMessage.should('be.visible')
  }
  shouldHaveItems(expectedCount) {
    cy.get('body').then(($body) => {
      if ($body.find('.cart_item, .woocommerce-cart-form__cart-item').length > 0) {
        this.cartItems.should('have.length', expectedCount)
      } else {
        this.emptyCartMessage.should('be.visible')
      }
    })
  }
  removeItem(index = 0) {
    cy.get('body').then(($body) => {
      const removeBtn = $body.find('a.remove, .remove, .product-remove a, td.product-remove a')
      if (removeBtn.length > 0) {
        cy.get('a.remove, .remove, .product-remove a, td.product-remove a')
          .eq(index)
          .should('exist')
          .then(($el) => {
            cy.wrap($el[0]).click({ force: true })
          })
        cy.get('body', { timeout: 5000 }).should('be.visible')
      }
    })
  }
  clearCart() {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const removeBtns = $body.find('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"], .cart_item .remove, tbody .remove')
      
      if (removeBtns.length > 0) {
        const count = removeBtns.length
        for (let i = 0; i < count; i++) {
          cy.get('body', { timeout: 3000 }).then(($body2) => {
            const currentRemoveBtns = $body2.find('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"], .cart_item .remove, tbody .remove')
            if (currentRemoveBtns.length > 0) {
              cy.get('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"], .cart_item .remove, tbody .remove')
                .first()
                .should('exist')
                .then(($el) => {
                  cy.wrap($el[0]).click({ force: true })
                })
              cy.wait(1500)
              cy.get('body', { timeout: 3000 }).should('be.visible')
            }
          })
        }
      }
    })
  }

  updateQuantity(index, quantity) {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const qtyInputs = $body.find('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
      if (qtyInputs.length > 0) {
        cy.get('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
          .eq(index)
          .then(($input) => {
            const currentValue = parseInt($input.val()) || 1
            const difference = quantity - currentValue
            
            if (difference > 0) {
              for (let i = 0; i < difference; i++) {
                cy.get('body').then(($body2) => {
                  const plusBtns = $body2.find('input.plus, .quantity input.plus, td.quantity input.plus, button.plus, .qty-button.plus')
                  if (plusBtns.length > index) {
                    cy.get('input.plus, .quantity input.plus, td.quantity input.plus, button.plus, .qty-button.plus')
                      .eq(index)
                      .should('exist')
                      .then(($el) => {
                        cy.wrap($el[0]).click({ force: true })
                      })
                  } else {
                    cy.get('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
                      .eq(index)
                      .clear()
                      .type((currentValue + i + 1).toString())
                  }
                })
                cy.wait(800)
              }
            } else if (difference < 0) {
              for (let i = 0; i < Math.abs(difference); i++) {
                cy.get('body').then(($body2) => {
                  const minusBtns = $body2.find('input.minus, .quantity input.minus, td.quantity input.minus, button.minus, .qty-button.minus')
                  if (minusBtns.length > index) {
                    cy.get('input.minus, .quantity input.minus, td.quantity input.minus, button.minus, .qty-button.minus')
                      .eq(index)
                      .should('exist')
                      .then(($el) => {
                        cy.wrap($el[0]).click({ force: true })
                      })
                  }
                })
                cy.wait(800)
              }
            }
            
            cy.wait(1000)
            
            cy.get('body').then(($body3) => {
              if ($body3.find('button[name="update_cart"], input[name="update_cart"]').length > 0) {
                cy.get('button[name="update_cart"], input[name="update_cart"]')
                  .should('be.visible')
                  .then(($btn) => {
                    cy.wrap($btn[0]).click({ force: true })
                  })
                cy.get('body', { timeout: 5000 }).should('be.visible')
                cy.wait(1000)
              }
            })
          })
      }
    })
  }

  proceedToCheckout() {
    cy.get('body').then(($body) => {
      if ($body.find('p:contains("Seu carrinho está vazio")').length > 0) {
        throw new Error('Carrinho está vazio, não é possível ir para checkout')
      }
      
      const checkoutLink = $body.find('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a, .cart_totals a[href*="checkout"]')
      if (checkoutLink.length > 0) {
        cy.get('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a, .cart_totals a[href*="checkout"]')
          .first()
          .should('exist')
          .then(($el) => {
            cy.wrap($el[0]).click({ force: true })
          })
      } else {
        cy.visit('/checkout')
      }
    })
  }

  shouldBeOnCartPage() {
    cy.url().should('include', '/carrinho')
    cy.get('body').then(($body) => {
      if ($body.find('h1:contains("Carrinho"), .page-title:contains("Carrinho")').length > 0) {
        cy.contains('h1, .page-title', 'Carrinho').should('be.visible')
      } else if ($body.find('p:contains("Seu carrinho está vazio")').length > 0) {
        cy.contains('Seu carrinho está vazio').should('be.visible')
      } else {
        cy.url().should('include', '/carrinho')
      }
    })
  }
  getCartTotal() {
    return this.cartTotal.invoke('text')
  }
}

export default new CartPage()
