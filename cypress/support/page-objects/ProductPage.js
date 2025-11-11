/**
 * Page Object para a página de produto
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de detalhes do produto.
 */

class ProductPage {
  // Seletores da página de produto
  get productTitle() {
    return cy.get('.product_title, h1.product_title')
  }

  get productPrice() {
    return cy.get('.price, .woocommerce-Price-amount')
  }

  get addToCartButton() {
    return cy.get('button[name="add-to-cart"], .single_add_to_cart_button')
  }

  get quantityInput() {
    return cy.get('.quantity input, input[name="quantity"]')
  }

  get productDescription() {
    return cy.get('.woocommerce-product-details__short-description, .product-description')
  }

  get productImage() {
    return cy.get('.woocommerce-product-gallery__image img, .product-image img')
  }

  get successMessage() {
    return cy.get('.woocommerce-message, .woocommerce-info')
  }

  get viewCartLink() {
    return cy.get('.woocommerce-message a[href*="carrinho"]')
  }

  /**
   * Verifica se está na página do produto
   * @param {string} productName - Nome do produto esperado
   */
  shouldBeOnProductPage(productName) {
    this.productTitle.should('be.visible').and('contain', productName)
  }

  /**
   * Adiciona produto ao carrinho
   * @param {number} quantity - Quantidade a adicionar (padrão: 1)
   */
  addToCart(quantity = 1) {
    if (quantity > 1) {
      this.quantityInput.clear().type(quantity.toString())
    }
    
    this.addToCartButton.should('be.visible').click()
    
    // Aguardar mensagem de sucesso
    this.successMessage.should('be.visible')
  }

  /**
   * Verifica mensagem de produto adicionado ao carrinho
   */
  shouldShowAddToCartSuccess() {
    this.successMessage
      .should('be.visible')
      .and('contain', 'adicionado')
  }

  /**
   * Clica no link para ver o carrinho
   */
  viewCart() {
    this.viewCartLink.should('be.visible').click()
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

