/**
 * Page Object para a página de detalhes do produto
 * 
 * Boa prática: Centraliza seletores e ações da página de produto
 * Gerencia variações de produtos (tamanho, cor) e adição ao carrinho
 * Exporta instância única (singleton) para reutilização
 */
class ProductPage {
  get productTitle() {
    return cy.get('h1.product_title, h1')
  }

  get productPrice() {
    return cy.get('.price, .woocommerce-Price-amount')
  }

  get addToCartButton() {
    return cy.get('#tbay-main-content button, button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button')
  }

  get quantityInput() {
    return cy.get('input[type="number"][name*="quantity"]:not([type="button"]), .quantity input[type="number"], input[name="quantity"]:not([type="button"]), input[aria-label*="Qty"]')
  }

  get quantityIncreaseButton() {
    return cy.get('button:contains("+"), .quantity .plus')
  }

  get quantityDecreaseButton() {
    return cy.get('button:contains("-"), .quantity .minus')
  }

  get productDescription() {
    return cy.get('.woocommerce-product-details__short-description, .product-description, #tab-description')
  }

  get productImage() {
    return cy.get('.woocommerce-product-gallery__image img, .product-image img, figure img')
  }

  get successMessage() {
    return cy.get('.woocommerce-message, .woocommerce-info, .notice-success')
  }

  get viewCartLink() {
    return cy.get('div.woocommerce-notices-wrapper a, .woocommerce-message a[href*="carrinho"], a:contains("carrinho"), a:contains("Ver carrinho")')
  }
  get sizeOptions() {
    return cy.get('radiogroup[name*="Size"], radiogroup[name*="size"] radio, input[type="radio"][name*="Size"], input[type="radio"][name*="size"]')
  }

  get colorOptions() {
    return cy.get('radiogroup[name*="Color"], radiogroup[name*="color"] radio, input[type="radio"][name*="Color"], input[type="radio"][name*="color"]')
  }

  shouldBeOnProductPage() {
    this.productTitle.should('be.visible')
    cy.url().should('include', '/product/')
  }

  selectVariations(variations = {}) {
    cy.get('body').then(($body) => {
      const hasVariationsTable = $body.find('table.variations, table[class*="variation"]').length > 0
      
      if (!hasVariationsTable) {
        return
      }

      const hasButtonVariations = $body.find('li.variable-item.button-variable-item').length > 0
      const hasRadioInputs = $body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="Color"]').length > 0

      if (hasButtonVariations) {
        cy.get('table.variations').within(() => {
          cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]').then(($sizeGroup) => {
            if ($sizeGroup.length > 0) {
              if (variations.size) {
                cy.get(`li.button-variable-item-${variations.size}, li.variable-item.button-variable-item`)
                  .contains(variations.size, { timeout: 2000 })
                  .should('be.visible')
                  .then(($el) => {
                    cy.wrap($el[0]).click({ force: true })
                  })
              } else {
                cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($sizes) => {
                    const sizeM = Array.from($sizes).find(li => 
                      li.textContent?.trim().toUpperCase() === 'M'
                    )
                    if (sizeM) {
                      cy.wrap(sizeM).click({ force: true })
                    } else if ($sizes.length > 0) {
                      cy.wrap($sizes[0]).click({ force: true })
                    }
                  })
              }
            }
          })
        })

        cy.get('body', { timeout: 2000 }).should('be.visible')

        cy.get('table.variations').within(() => {
          cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]').then(($colorGroup) => {
            if ($colorGroup.length > 0) {
              if (variations.color) {
                cy.get(`li.button-variable-item-${variations.color}, li.variable-item.button-variable-item`)
                  .contains(variations.color, { timeout: 2000 })
                  .should('be.visible')
                  .then(($el) => {
                    cy.wrap($el[0]).click({ force: true })
                  })
              } else {
                cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($colors) => {
                    const whiteOption = Array.from($colors).find(li => 
                      li.textContent?.trim().toLowerCase() === 'white'
                    )
                    if (whiteOption) {
                      cy.wrap(whiteOption).click({ force: true })
                    } else if ($colors.length > 0) {
                      cy.wrap($colors[0]).click({ force: true })
                    }
                  })
              }
            }
          })
        })

        cy.get('body', { timeout: 2000 }).should('be.visible')
      } else if (hasRadioInputs) {
        const hasSize = $body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="size"], input[type="radio"][name*="attribute_size"]').length > 0
        const hasColor = $body.find('input[type="radio"][name*="Color"], input[type="radio"][name*="color"], input[type="radio"][name*="attribute_color"]').length > 0
        
        if (hasSize) {
          if (variations.size) {
            cy.get('input[type="radio"][name*="Size"], input[type="radio"][name*="size"], input[type="radio"][name*="attribute_size"]')
              .filter(`[value="${variations.size}"]`)
              .should('be.visible')
              .check()
          } else {
            cy.get('input[type="radio"][name*="Size"], input[type="radio"][name*="size"], input[type="radio"][name*="attribute_size"]')
              .first()
              .should('be.visible')
              .check()
          }
        }

        if (hasColor) {
          if (variations.color) {
            cy.get('input[type="radio"][name*="Color"], input[type="radio"][name*="color"], input[type="radio"][name*="attribute_color"]')
              .filter(`[value="${variations.color}"]`)
              .should('be.visible')
              .check()
          } else {
            cy.get('input[type="radio"][name*="Color"], input[type="radio"][name*="color"], input[type="radio"][name*="attribute_color"]')
              .first()
              .should('be.visible')
              .check()
          }
        }
      }

      if (hasButtonVariations || hasRadioInputs) {
        cy.get('body', { timeout: 2000 }).should('be.visible')
        
        if (!variations.size && !variations.color && hasButtonVariations) {
          cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 3000 }).then(($btn) => {
            const isUnavailable = $btn.hasClass('wc-variation-is-unavailable') || 
                                  $btn.hasClass('wc-variation-selection-needed')
            
            if (isUnavailable) {
              cy.get('table.variations').within(() => {
                cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($sizes) => {
                    const sizeM = Array.from($sizes).find(li => 
                      li.textContent?.trim().toUpperCase() === 'M'
                    )
                    if (sizeM) {
                      cy.wrap(sizeM).click({ force: true })
                    } else if ($sizes.length > 1) {
                      cy.wrap($sizes[1]).click({ force: true })
                    }
                  })
                
                cy.get('body', { timeout: 5000 }).should('be.visible')
                
                cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($colors) => {
                    const whiteOption = Array.from($colors).find(li => 
                      li.textContent?.trim().toLowerCase() === 'white'
                    )
                    if (whiteOption) {
                      cy.wrap(whiteOption).click({ force: true })
                    } else if ($colors.length > 1) {
                      cy.wrap($colors[1]).click({ force: true })
                    }
                  })
                
                cy.get('body', { timeout: 5000 }).should('be.visible')
              })
            }
          })
        }
        
        cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 10000 })
          .should('be.visible')
          .should('not.have.class', 'disabled')
          .should('not.have.class', 'wc-variation-selection-needed')
          .should('not.have.class', 'wc-variation-is-unavailable')
          .should('not.be.disabled')
      }
    })
  }

  addToCart(quantity = 1, variations = {}) {
    cy.get('body').then(($body) => {
      const hasVariationsTable = $body.find('table.variations, table[class*="variation"]').length > 0
      const hasButtonVariations = $body.find('li.variable-item.button-variable-item').length > 0
      const hasRadioInputs = $body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="Color"]').length > 0
      
      if (hasVariationsTable || hasButtonVariations || hasRadioInputs) {
        this.selectVariations(variations)
      }
    })

    if (quantity > 1) {
      cy.get('input[type="number"][name*="quantity"], .quantity input[type="number"], input[name="quantity"], input[aria-label*="Qty"]')
        .should('be.visible')
        .clear()
        .type(quantity.toString())
    }
    
    cy.get('#tbay-main-content button, button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 10000 })
      .should('be.visible')
      .should('not.have.class', 'disabled')
      .should('not.have.class', 'wc-variation-selection-needed')
      .should('not.have.class', 'wc-variation-is-unavailable')
      .should('not.be.disabled')
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    
    cy.get('body', { timeout: 5000 }).should('be.visible')
  }

  shouldShowAddToCartSuccess() {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const hasSuccessMessage = $body.find('.woocommerce-message, .alert').length > 0
      
      if (hasSuccessMessage) {
        cy.get('.woocommerce-message, .alert', { timeout: 5000 })
          .should('be.visible')
          .should('contain.text', 'adicionado')
      } else {
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
          
          if (foundCartButton && cartCount > 0) {
            cy.wrap(cartCount).should('be.at.least', 1)
          } else {
            cy.get('body', { timeout: 2000 }).should('be.visible')
            cy.get('.woocommerce-message, .alert', { timeout: 3000 })
              .should('exist')
              .should('contain.text', 'adicionado')
          }
        })
      }
    })
  }

  viewCart() {
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const hasViewCartLink = $body.find('div.woocommerce-notices-wrapper a, .woocommerce-message a[href*="carrinho"], a:contains("Ver carrinho")').length > 0
      
      if (hasViewCartLink) {
        cy.get('div.woocommerce-notices-wrapper a, .woocommerce-message a[href*="carrinho"], a:contains("Ver carrinho")', { timeout: 5000 })
          .first()
          .should('exist')
          .then(($el) => {
            cy.wrap($el[0]).click({ force: true })
          })
      } else {
        cy.wait(1000)
        cy.visit('/carrinho')
      }
    })
  }

  getProductPrice() {
    return this.productPrice.invoke('text')
  }

  shouldHaveProductImage() {
    this.productImage.should('be.visible').and('have.attr', 'src')
  }
}

export default new ProductPage()
