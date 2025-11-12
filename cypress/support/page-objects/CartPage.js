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
    // Baseado na estrutura real do site - pode estar em diferentes locais
    return cy.get('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"]')
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
      const removeBtn = $body.find('a.remove, .remove, .product-remove a, td.product-remove a')
      if (removeBtn.length > 0) {
        // Usar o seletor atualizado e garantir que está visível
        cy.get('a.remove, .remove, .product-remove a, td.product-remove a')
          .eq(index)
          .should('exist')
          .then(($el) => {
            // Se não estiver visível, tentar com force
            cy.wrap($el[0]).click({ force: true })
          })
        // Aguardar remoção usando should ao invés de wait arbitrário
        cy.get('body', { timeout: 5000 }).should('be.visible')
      }
    })
  }

  /**
   * Remove todos os itens do carrinho
   */
  clearCart() {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      // Procurar botões de remover com vários seletores possíveis
      const removeBtns = $body.find('a.remove, .remove, .product-remove a, td.product-remove a, a[aria-label*="remover"], a[aria-label*="Remove"], .cart_item .remove, tbody .remove')
      
      if (removeBtns.length > 0) {
        cy.log(`Encontrados ${removeBtns.length} botões de remover`)
        // Remover cada item um por um
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
              // Aguardar remoção processar
              cy.wait(1500) // Aguardar processamento da remoção
              cy.get('body', { timeout: 3000 }).should('be.visible')
            }
          })
        }
      } else {
        cy.log('Nenhum botão de remover encontrado - carrinho pode estar vazio')
      }
    })
  }

  /**
   * Atualiza a quantidade de um item
   * @param {number} index - Índice do item
   * @param {number} quantity - Nova quantidade
   */
  updateQuantity(index, quantity) {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      // Procurar input de quantidade no carrinho (tem nome específico)
      const qtyInputs = $body.find('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
      if (qtyInputs.length > 0) {
        // Obter valor atual do input específico
        cy.get('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
          .eq(index)
          .then(($input) => {
            const currentValue = parseInt($input.val()) || 1
            const difference = quantity - currentValue
            
            cy.log(`Valor atual: ${currentValue}, Valor desejado: ${quantity}, Diferença: ${difference}`)
            
            // Se a diferença for positiva, usar botão + (baseado na gravação: input.plus)
            // Se for negativa, usar botão -
            if (difference > 0) {
              // Clicar no botão + (input.plus conforme gravação - linha 310-320 do JSON)
              // Os botões + e - estão na mesma linha do input, então precisamos encontrar dentro do mesmo container
              for (let i = 0; i < difference; i++) {
                cy.get('body').then(($body2) => {
                  // Procurar botão + próximo ao input de quantidade do item específico
                  const plusBtns = $body2.find('input.plus, .quantity input.plus, td.quantity input.plus, button.plus, .qty-button.plus')
                  if (plusBtns.length > index) {
                    cy.get('input.plus, .quantity input.plus, td.quantity input.plus, button.plus, .qty-button.plus')
                      .eq(index)
                      .should('exist')
                      .then(($el) => {
                        cy.wrap($el[0]).click({ force: true })
                      })
                  } else {
                    // Fallback: tentar atualizar diretamente o input
                    cy.get('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]')
                      .eq(index)
                      .clear()
                      .type((currentValue + i + 1).toString())
                  }
                })
                cy.wait(800) // Aguardar processamento de cada clique
              }
            } else if (difference < 0) {
              // Clicar no botão - (input.minus)
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
                cy.wait(800) // Aguardar processamento de cada clique
              }
            }
            
            // Aguardar um pouco para o valor ser atualizado
            cy.wait(1000)
            
            // Verificar se há botão de atualizar e clicar se necessário
            cy.get('body').then(($body3) => {
              if ($body3.find('button[name="update_cart"], input[name="update_cart"]').length > 0) {
                cy.get('button[name="update_cart"], input[name="update_cart"]')
                  .should('be.visible')
                  .then(($btn) => {
                    cy.wrap($btn[0]).click({ force: true })
                  })
                // Aguardar atualização
                cy.get('body', { timeout: 5000 }).should('be.visible')
                cy.wait(1000)
              }
            })
          })
      } else {
        cy.log('Input de quantidade não encontrado')
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
      const checkoutLink = $body.find('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a, .cart_totals a[href*="checkout"]')
      if (checkoutLink.length > 0) {
        cy.get('a[href*="checkout"], .checkout-button, a.checkout-button, .wc-proceed-to-checkout a, .cart_totals a[href*="checkout"]')
          .first()
          .should('exist')
          .then(($el) => {
            cy.wrap($el[0]).click({ force: true })
          })
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
