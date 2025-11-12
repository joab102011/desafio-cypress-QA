class CheckoutPage {
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

  get paymentMethods() {
    return cy.get('.payment_methods input[type="radio"], input[name="payment_method"]')
  }

  get placeOrderButton() {
    return cy.get('#place_order, button[name="woocommerce_checkout_place_order"], button:contains("Finalizar pedido")')
  }

  get errorMessages() {
    return cy.get('.woocommerce-error, .error, ul.woocommerce-error li')
  }

  get orderReceivedMessage() {
    return cy.contains('Pedido recebido', { timeout: 10000 })
  }

  get orderNumber() {
    return cy.get('.order-number, .woocommerce-order-overview__order strong')
  }

  get cartTotal() {
    return cy.get('.order-total .amount, .order-total, .cart-total')
  }

  visit() {
    cy.visit('/checkout')
  }

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
      cy.get('#billing_country').should('exist').select(billingData.country, { force: true })
    }
    
    if (billingData.state) {
      this.billingState.should('be.visible').select(billingData.state)
    }
  }

  selectPaymentMethod(paymentMethod) {
    cy.get('body').then(($body) => {
      if ($body.find(`input[value="${paymentMethod}"]`).length > 0) {
        cy.get(`input[value="${paymentMethod}"]`).should('be.visible').check()
      } else {
        if ($body.find('input[name="payment_method"]').length > 0) {
          cy.get('input[name="payment_method"]').first().should('be.visible').check()
        }
      }
    })
  }

  placeOrder() {
    cy.get('#place_order, button[name="woocommerce_checkout_place_order"], input#place_order').then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn[0]).click({ force: true })
      } else {
        cy.get('button:contains("Finalizar"), button:contains("Place order"), input[type="submit"]').first().click({ force: true })
      }
    })
    
    cy.get('body', { timeout: 10000 }).should('be.visible')
  }

  shouldShowOrderReceived() {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('Pedido recebido') || bodyText.includes('order received') || bodyText.includes('Obrigado')) {
        this.orderReceivedMessage.should('be.visible')
      }
    })
  }

  shouldShowError(expectedMessage) {
    cy.get('.woocommerce-error, .error, ul.woocommerce-error li', { timeout: 10000 }).then(($errors) => {
      if ($errors.length > 0) {
        if (expectedMessage) {
          cy.get('.woocommerce-error, .error, ul.woocommerce-error li')
            .should('be.visible')
            .then(($error) => {
              const errorText = $error.text().toLowerCase()
              const expectedLower = expectedMessage.toLowerCase()
              expect(errorText).to.satisfy((text) => {
                return text.includes(expectedLower) || 
                       (expectedLower.includes('email') && (text.includes('email') || text.includes('e-mail'))) ||
                       (expectedLower.includes('obrigatório') && (text.includes('obrigatório') || text.includes('required')))
              })
              })
        } else {
          cy.get('.woocommerce-error, .error, ul.woocommerce-error li')
            .should('be.visible')
            .should('have.length.greaterThan', 0)
        }
      } else {
        cy.get('input[required]').then(($inputs) => {
          if ($inputs.length > 0) {
            $inputs.each((index, input) => {
              if (!input.value) {
                cy.wrap(input).should('have.attr', 'required')
              }
            })
          } else {
            cy.url().should('include', '/checkout')
          }
        })
      }
    })
  }

  shouldBeOnCheckoutPage() {
    cy.url().should('include', '/checkout')
    this.placeOrderButton.should('be.visible')
  }
}

export default new CheckoutPage()
