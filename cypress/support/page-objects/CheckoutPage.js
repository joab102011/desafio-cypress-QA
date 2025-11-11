/**
 * Page Object para a página de checkout
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de checkout.
 */

class CheckoutPage {
  // Seletores da página de checkout - Dados de cobrança
  get billingFirstName() {
    return cy.get('#billing_first_name')
  }

  get billingLastName() {
    return cy.get('#billing_last_name')
  }

  get billingEmail() {
    return cy.get('#billing_email')
  }

  get billingPhone() {
    return cy.get('#billing_phone')
  }

  get billingAddress1() {
    return cy.get('#billing_address_1')
  }

  get billingCity() {
    return cy.get('#billing_city')
  }

  get billingPostcode() {
    return cy.get('#billing_postcode')
  }

  get billingCountry() {
    return cy.get('#billing_country')
  }

  get billingState() {
    return cy.get('#billing_state')
  }

  // Seletores de métodos de pagamento
  get paymentMethods() {
    return cy.get('.payment_methods input[type="radio"]')
  }

  get placeOrderButton() {
    return cy.get('#place_order, button[name="woocommerce_checkout_place_order"]')
  }

  // Seletores de validação
  get errorMessages() {
    return cy.get('.woocommerce-error, .error')
  }

  get orderReceivedMessage() {
    return cy.contains('Pedido recebido')
  }

  get orderNumber() {
    return cy.get('.order-number, .woocommerce-order-overview__order strong')
  }

  /**
   * Visita a página de checkout
   */
  visit() {
    cy.visit('/checkout')
  }

  /**
   * Preenche os dados de cobrança
   * @param {object} billingData - Objeto com os dados de cobrança
   */
  fillBillingData(billingData) {
    if (billingData.firstName) {
      this.billingFirstName.clear().type(billingData.firstName)
    }
    
    if (billingData.lastName) {
      this.billingLastName.clear().type(billingData.lastName)
    }
    
    if (billingData.email) {
      this.billingEmail.clear().type(billingData.email)
    }
    
    if (billingData.phone) {
      this.billingPhone.clear().type(billingData.phone)
    }
    
    if (billingData.address) {
      this.billingAddress1.clear().type(billingData.address)
    }
    
    if (billingData.city) {
      this.billingCity.clear().type(billingData.city)
    }
    
    if (billingData.postcode) {
      this.billingPostcode.clear().type(billingData.postcode)
    }
    
    if (billingData.country) {
      this.billingCountry.select(billingData.country)
    }
    
    if (billingData.state) {
      this.billingState.select(billingData.state)
    }
  }

  /**
   * Seleciona método de pagamento
   * @param {string} paymentMethod - Método de pagamento (ex: 'bacs', 'cheque', 'cod')
   */
  selectPaymentMethod(paymentMethod) {
    cy.get(`input[value="${paymentMethod}"]`).check({ force: true })
  }

  /**
   * Finaliza o pedido
   */
  placeOrder() {
    this.placeOrderButton.should('be.visible').click()
    
    // Aguardar processamento
    cy.wait(3000)
  }

  /**
   * Verifica se o pedido foi realizado com sucesso
   */
  shouldShowOrderReceived() {
    this.orderReceivedMessage.should('be.visible')
  }

  /**
   * Verifica mensagens de erro
   * @param {string} expectedMessage - Mensagem esperada
   */
  shouldShowError(expectedMessage) {
    this.errorMessages.should('be.visible').and('contain', expectedMessage)
  }

  /**
   * Verifica se está na página de checkout
   */
  shouldBeOnCheckoutPage() {
    cy.url().should('include', '/checkout')
    this.placeOrderButton.should('be.visible')
  }
}

export default new CheckoutPage()

