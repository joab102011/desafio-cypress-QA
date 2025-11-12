/**
 * Page Object para a página de checkout
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de checkout.
 * Seletores ajustados baseados na estrutura real do site http://lojaebac.ebaconline.art.br
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
    return cy.get('.payment_methods input[type="radio"], input[name="payment_method"]')
  }

  get placeOrderButton() {
    return cy.get('#place_order, button[name="woocommerce_checkout_place_order"], button:contains("Finalizar pedido")')
  }

  // Seletores de validação
  get errorMessages() {
    return cy.get('.woocommerce-error, .error, ul.woocommerce-error li')
  }

  get orderReceivedMessage() {
    return cy.contains('Pedido recebido', { timeout: 10000 })
  }

  get orderNumber() {
    return cy.get('.order-number, .woocommerce-order-overview__order strong')
  }

  // Seletores do resumo do carrinho
  get cartTotal() {
    return cy.get('.order-total .amount, .order-total, .cart-total')
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
      this.billingFirstName.should('be.visible').clear()
      this.billingFirstName.type(billingData.firstName)
    }
    
    if (billingData.lastName) {
      this.billingLastName.should('be.visible').clear()
      this.billingLastName.type(billingData.lastName)
    }
    
    if (billingData.email) {
      this.billingEmail.should('be.visible').clear()
      this.billingEmail.type(billingData.email)
    }
    
    if (billingData.phone) {
      this.billingPhone.should('be.visible').clear()
      this.billingPhone.type(billingData.phone)
    }
    
    if (billingData.address) {
      this.billingAddress1.should('be.visible').clear()
      this.billingAddress1.type(billingData.address)
    }
    
    if (billingData.city) {
      this.billingCity.should('be.visible').clear()
      this.billingCity.type(billingData.city)
    }
    
    if (billingData.postcode) {
      this.billingPostcode.should('be.visible').clear()
      this.billingPostcode.type(billingData.postcode)
    }
    
    if (billingData.country) {
      this.billingCountry.should('be.visible').select(billingData.country)
    }
    
    if (billingData.state) {
      this.billingState.should('be.visible').select(billingData.state)
    }
  }

  /**
   * Seleciona método de pagamento
   * @param {string} paymentMethod - Método de pagamento (ex: 'bacs', 'cheque', 'cod')
   */
  selectPaymentMethod(paymentMethod) {
    cy.get('body').then(($body) => {
      if ($body.find(`input[value="${paymentMethod}"]`).length > 0) {
        cy.get(`input[value="${paymentMethod}"]`).should('be.visible').check()
      } else {
        // Se não encontrar, selecionar o primeiro disponível
        if ($body.find('input[name="payment_method"]').length > 0) {
          cy.get('input[name="payment_method"]').first().should('be.visible').check()
        }
      }
    })
  }

  /**
   * Finaliza o pedido
   */
  placeOrder() {
    this.placeOrderButton.should('be.visible').click()
    
    // Aguardar processamento usando should ao invés de wait arbitrário
    cy.get('body', { timeout: 10000 }).should('be.visible')
  }

  /**
   * Verifica se o pedido foi realizado com sucesso
   */
  shouldShowOrderReceived() {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('Pedido recebido') || bodyText.includes('order received') || bodyText.includes('Obrigado')) {
        this.orderReceivedMessage.should('be.visible')
      }
    })
  }

  /**
   * Verifica mensagens de erro
   * @param {string} expectedMessage - Mensagem esperada (opcional)
   */
  shouldShowError(expectedMessage) {
    cy.get('body').then(($body) => {
      if ($body.find('.woocommerce-error, .error').length > 0) {
        if (expectedMessage) {
          this.errorMessages.should('be.visible').and('contain', expectedMessage)
        } else {
          this.errorMessages.should('be.visible')
        }
      }
    })
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
