/**
 * Page Object para a página de produto
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de detalhes do produto.
 * Seletores ajustados baseados na estrutura real do site http://lojaebac.ebaconline.art.br
 */

class ProductPage {
  // Seletores da página de produto - baseados na estrutura real
  get productTitle() {
    return cy.get('h1.product_title, h1')
  }

  get productPrice() {
    return cy.get('.price, .woocommerce-Price-amount')
  }

  get addToCartButton() {
    // Botão "Comprar" no site - usar seletor mais específico
    return cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button')
  }

  get quantityInput() {
    // Usar seletor mais específico para o input de quantidade (não os botões)
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
    return cy.get('.woocommerce-message a[href*="carrinho"], a:contains("carrinho")')
  }

  // Seletores para variações de produto (se existirem)
  // As variações são elementos radio dentro de radiogroups, não inputs diretos
  get sizeOptions() {
    return cy.get('radiogroup[name*="Size"], radiogroup[name*="size"] radio, input[type="radio"][name*="Size"], input[type="radio"][name*="size"]')
  }

  get colorOptions() {
    return cy.get('radiogroup[name*="Color"], radiogroup[name*="color"] radio, input[type="radio"][name*="Color"], input[type="radio"][name*="color"]')
  }

  /**
   * Verifica se está na página do produto
   */
  shouldBeOnProductPage() {
    this.productTitle.should('be.visible')
    cy.url().should('include', '/product/')
  }

  /**
   * Seleciona variações do produto (tamanho e cor) se necessário
   * As variações são elementos <li> com classe variable-item button-variable-item
   * dentro de <ul> com role="radiogroup", não inputs de radio tradicionais
   * @param {object} variations - Objeto com variações {size: 'M', color: 'White'}
   */
  selectVariations(variations = {}) {
    // Verificar se há variações disponíveis
    cy.get('body').then(($body) => {
      // Verificar se há tabela de variações
      const hasVariationsTable = $body.find('table.variations, table[class*="variation"]').length > 0
      
      if (!hasVariationsTable) {
        // Se não houver tabela de variações, não há nada para selecionar
        return
      }

      // Verificar se há elementos <li> com classe variable-item (variações em formato de botão)
      const hasButtonVariations = $body.find('li.variable-item.button-variable-item').length > 0
      
      // Verificar se há inputs de radio tradicionais (fallback)
      const hasRadioInputs = $body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="Color"]').length > 0

      if (hasButtonVariations) {
        // Usar elementos <li> com classe variable-item - método principal
        // Selecionar tamanho (Size)
        cy.get('table.variations').within(() => {
          // Procurar por ul com role="radiogroup" que contém opções de tamanho
          cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]').then(($sizeGroup) => {
            if ($sizeGroup.length > 0) {
              if (variations.size) {
                // Clicar no <li> que contém o texto do tamanho
                cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]')
                  .find('li.variable-item.button-variable-item')
                  .contains(variations.size, { timeout: 2000 })
                  .should('be.visible')
                  .click()
              } else {
                // Priorizar tamanho M (geralmente tem mais estoque), senão o primeiro disponível
                cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($sizes) => {
                    const sizeM = Array.from($sizes).find(li => 
                      li.textContent?.trim().toUpperCase() === 'M'
                    )
                    if (sizeM) {
                      cy.wrap(sizeM).should('be.visible').click()
                    } else {
                      cy.wrap($sizes.first()).should('be.visible').click()
                    }
                  })
              }
            }
          })
        })

        // Aguardar processamento após selecionar tamanho
        cy.get('body', { timeout: 2000 }).should('be.visible')

        // Selecionar cor (Color)
        cy.get('table.variations').within(() => {
          cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]').then(($colorGroup) => {
            if ($colorGroup.length > 0) {
              if (variations.color) {
                // Clicar no <li> que contém o texto da cor
                cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]')
                  .find('li.variable-item.button-variable-item')
                  .contains(variations.color, { timeout: 2000 })
                  .should('be.visible')
                  .click()
              } else {
                // Priorizar cor "White" (geralmente está disponível), senão a primeira cor
                cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($colors) => {
                    const whiteOption = Array.from($colors).find(li => 
                      li.textContent?.trim().toLowerCase() === 'white'
                    )
                    if (whiteOption) {
                      cy.wrap(whiteOption).should('be.visible').click()
                    } else {
                      cy.wrap($colors.first()).should('be.visible').click()
                    }
                  })
              }
            }
          })
        })

        // Aguardar processamento após selecionar cor
        cy.get('body', { timeout: 2000 }).should('be.visible')
      } else if (hasRadioInputs) {
        // Fallback: usar inputs de radio tradicionais se não houver elementos <li>
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

      // Aguardar que as variações sejam processadas e verificar se está disponível
      if (hasButtonVariations || hasRadioInputs) {
        // Aguardar processamento das variações
        cy.get('body', { timeout: 2000 }).should('be.visible')
        
        // Verificar se o produto está disponível em estoque
        // Se não foram especificadas variações e não está disponível, tentar outras combinações
        if (!variations.size && !variations.color && hasButtonVariations) {
          cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 3000 }).then(($btn) => {
            const isUnavailable = $btn.hasClass('wc-variation-is-unavailable') || 
                                  $btn.hasClass('wc-variation-selection-needed')
            
            if (isUnavailable) {
              // Tentar com tamanho M e cor White (combinações mais comuns e geralmente disponíveis)
              cy.get('table.variations').within(() => {
                // Tentar tamanho M (geralmente tem mais estoque)
                cy.get('ul[role="radiogroup"][aria-label="Size"], ul[role="radiogroup"][data-attribute_name*="size"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($sizes) => {
                    const sizeM = Array.from($sizes).find(li => 
                      li.textContent?.trim().toUpperCase() === 'M'
                    )
                    if (sizeM) {
                      cy.wrap(sizeM).should('be.visible').click()
                    } else if ($sizes.length > 1) {
                      cy.wrap($sizes.eq(1)).should('be.visible').click()
                    }
                  })
                
                cy.get('body', { timeout: 2000 }).should('be.visible')
                
                // Tentar cor White
                cy.get('ul[role="radiogroup"][aria-label="Color"], ul[role="radiogroup"][data-attribute_name*="color"]')
                  .find('li.variable-item.button-variable-item')
                  .then(($colors) => {
                    const whiteOption = Array.from($colors).find(li => 
                      li.textContent?.trim().toLowerCase() === 'white'
                    )
                    if (whiteOption) {
                      cy.wrap(whiteOption).should('be.visible').click()
                    } else if ($colors.length > 1) {
                      cy.wrap($colors.eq(1)).should('be.visible').click()
                    }
                  })
                
                cy.get('body', { timeout: 2000 }).should('be.visible')
              })
            }
          })
        }
        
        // Aguardar que o botão de adicionar ao carrinho esteja habilitado e disponível
        cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 10000 })
          .should('be.visible')
          .should('not.have.class', 'disabled')
          .should('not.have.class', 'wc-variation-selection-needed')
          .should('not.have.class', 'wc-variation-is-unavailable')
          .should('not.be.disabled')
      }
    })
  }

  /**
   * Adiciona produto ao carrinho
   * @param {number} quantity - Quantidade a adicionar (padrão: 1)
   * @param {object} variations - Variações do produto (tamanho, cor)
   */
  addToCart(quantity = 1, variations = {}) {
    // Verificar se há variações e selecioná-las primeiro
    cy.get('body').then(($body) => {
      // Verificar se há tabela de variações, elementos <li> com classe variable-item, ou inputs de radio
      const hasVariationsTable = $body.find('table.variations, table[class*="variation"]').length > 0
      const hasButtonVariations = $body.find('li.variable-item.button-variable-item').length > 0
      const hasRadioInputs = $body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="Color"]').length > 0
      
      if (hasVariationsTable || hasButtonVariations || hasRadioInputs) {
        // Selecionar variações - isso já aguarda o botão ficar visível
        this.selectVariations(variations)
      }
    })

    // Ajustar quantidade se necessário
    if (quantity > 1) {
      // Usar o input de quantidade correto (spinbutton)
      cy.get('input[type="number"][name*="quantity"], .quantity input[type="number"], input[name="quantity"], input[aria-label*="Qty"]')
        .should('be.visible')
        .clear()
        .type(quantity.toString())
    }
    
    // Garantir que o botão está visível e habilitado antes de clicar
    cy.get('button.single_add_to_cart_button, button[name="add-to-cart"], .add_to_cart_button', { timeout: 10000 })
      .should('be.visible')
      .should('not.have.class', 'disabled')
      .should('not.have.class', 'wc-variation-selection-needed')
      .should('not.have.class', 'wc-variation-is-unavailable')
      .should('not.be.disabled')
      .click()
    
    // Aguardar mensagem de sucesso ou atualização do carrinho
    // Aguardar um pouco para o sistema processar a adição
    cy.get('body', { timeout: 2000 }).should('be.visible')
  }

  /**
   * Verifica mensagem de produto adicionado ao carrinho
   */
  shouldShowAddToCartSuccess() {
    // Aguardar que a mensagem de sucesso apareça ou o carrinho seja atualizado
    // Verificar mensagem OU contador do carrinho - qualquer um indica sucesso
    
    // Primeiro, tentar verificar mensagem de sucesso (mais rápido)
    // A mensagem pode aparecer como .woocommerce-message ou .alert
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const hasSuccessMessage = $body.find('.woocommerce-message, .alert').length > 0
      
      if (hasSuccessMessage) {
        // Verificar mensagem de sucesso - deve conter texto sobre produto adicionado
        cy.get('.woocommerce-message, .alert', { timeout: 5000 })
          .should('be.visible')
          .should('contain.text', 'adicionado')
      } else {
        // Se não houver mensagem, verificar contador do carrinho no header
        // Isso é uma alternativa válida para confirmar que o produto foi adicionado
        cy.get('button', { timeout: 5000 }).then(($buttons) => {
          let cartCount = 0
          let foundCartButton = false
          
          $buttons.each((i, btn) => {
            const text = btn.textContent || btn.innerText || ''
            if (text.includes('Cart') || text.includes('carrinho')) {
              foundCartButton = true
              // Extrair o último número do texto (contador de itens)
              // Exemplo: "Cart : R$84,00 1" -> pegar o último número (1)
              const numbers = text.match(/\d+/g)
              if (numbers && numbers.length > 0) {
                cartCount = parseInt(numbers[numbers.length - 1])
                return false
              }
            }
          })
          
          // Se encontrou botão do carrinho e contador > 0, produto foi adicionado
          if (foundCartButton && cartCount > 0) {
            // Produto foi adicionado com sucesso
            cy.wrap(cartCount).should('be.at.least', 1)
          } else {
            // Se não encontrou, aguardar mais um pouco e verificar mensagem novamente
            cy.get('body', { timeout: 2000 }).should('be.visible')
            // Tentar verificar mensagem de sucesso novamente (pode ter aparecido)
            cy.get('.woocommerce-message, .alert', { timeout: 3000 })
              .should('exist')
              .should('contain.text', 'adicionado')
          }
        })
      }
    })
  }

  /**
   * Clica no link para ver o carrinho
   */
  viewCart() {
    cy.get('body').then(($body) => {
      if ($body.find('.woocommerce-message a[href*="carrinho"]').length > 0) {
        this.viewCartLink.should('be.visible').click()
      } else {
        // Se não houver link direto, navegar para o carrinho
        cy.visit('/carrinho')
      }
    })
  }

  /**
   * Obtém o preço do produto
   * @returns {Cypress.Chainable} - Chainable com o preço
   */
  getProductPrice() {
    return this.productPrice.invoke('text')
  }

  /**
   * Verifica se o produto tem imagem
   */
  shouldHaveProductImage() {
    this.productImage.should('be.visible').and('have.attr', 'src')
  }
}

export default new ProductPage()
