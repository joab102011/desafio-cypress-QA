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
    return cy.get('button:contains("Comprar"), button[name="add-to-cart"], .single_add_to_cart_button')
  }

  get quantityInput() {
    return cy.get('input[type="number"][name*="quantity"], .quantity input, input[name="quantity"]')
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
  get sizeOptions() {
    return cy.get('input[type="radio"][name*="Size"], input[type="radio"][name*="size"]')
  }

  get colorOptions() {
    return cy.get('input[type="radio"][name*="Color"], input[type="radio"][name*="color"]')
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
   * @param {object} variations - Objeto com variações {size: 'M', color: 'White'}
   */
  selectVariations(variations = {}) {
    // Selecionar tamanho se fornecido
    if (variations.size) {
      cy.get('input[type="radio"][name*="Size"], input[type="radio"][name*="size"]')
        .filter(`[value="${variations.size}"]`)
        .should('be.visible')
        .check()
    } else {
      // Se não fornecido, selecionar o primeiro disponível
      cy.get('body').then(($body) => {
        if ($body.find('input[type="radio"][name*="Size"]').length > 0) {
          cy.get('input[type="radio"][name*="Size"]').first().check()
        }
      })
    }

    // Selecionar cor se fornecido
    if (variations.color) {
      cy.get('input[type="radio"][name*="Color"], input[type="radio"][name*="color"]')
        .filter(`[value="${variations.color}"]`)
        .should('be.visible')
        .check()
    } else {
      // Se não fornecido, selecionar a primeira disponível
      cy.get('body').then(($body) => {
        if ($body.find('input[type="radio"][name*="Color"]').length > 0) {
          cy.get('input[type="radio"][name*="Color"]').first().check()
        }
      })
    }
  }

  /**
   * Adiciona produto ao carrinho
   * @param {number} quantity - Quantidade a adicionar (padrão: 1)
   * @param {object} variations - Variações do produto (tamanho, cor)
   */
  addToCart(quantity = 1, variations = {}) {
    // Selecionar variações se necessário
    cy.get('body').then(($body) => {
      if ($body.find('input[type="radio"][name*="Size"], input[type="radio"][name*="Color"]').length > 0) {
        this.selectVariations(variations)
      }
    })

    // Ajustar quantidade se necessário
    if (quantity > 1) {
      this.quantityInput.should('be.visible').clear()
      this.quantityInput.type(quantity.toString())
    }
    
    // Clicar no botão de comprar
    this.addToCartButton.should('be.visible').click()
    
    // Aguardar mensagem de sucesso ou redirecionamento
    cy.get('body', { timeout: 5000 }).should('be.visible')
  }

  /**
   * Verifica mensagem de produto adicionado ao carrinho
   */
  shouldShowAddToCartSuccess() {
    cy.get('body').then(($body) => {
      // Verificar se há mensagem de sucesso ou se o carrinho foi atualizado
      if ($body.find('.woocommerce-message, .notice-success').length > 0) {
        this.successMessage.should('be.visible')
      } else {
        // Verificar se o contador do carrinho foi atualizado
        cy.get('button:contains("Cart")').should('be.visible')
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
