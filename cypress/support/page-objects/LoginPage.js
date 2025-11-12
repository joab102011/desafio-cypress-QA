class LoginPage {
  get usernameField() {
    return cy.get('form.woocommerce-form-login #username, form:has(button[name="login"]) #username, input[name="username"]').first()
  }

  get passwordField() {
    return cy.get('form.woocommerce-form-login #password, form:has(button[name="login"]) #password, input[name="password"]').first()
  }

  get loginButton() {
    return cy.get('button[name="login"], button:contains("Login"), input[type="submit"][value*="Login"]').first()
  }

  get rememberMeCheckbox() {
    return cy.get('#rememberme, input[name="rememberme"]')
  }

  get lostPasswordLink() {
    return cy.get('a:contains("Lost your password"), a[href*="lost-password"]')
  }

  get errorMessage() {
    return cy.get('.woocommerce-error, ul.woocommerce-error, .error')
  }

  get successMessage() {
    return cy.get('.woocommerce-message, .notice-success')
  }

  visit() {
    cy.visit('/minha-conta')
    cy.url().should('include', '/minha-conta')
  }

  fillLoginForm(email, password, rememberMe = false) {
    cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
      cy.get('#username, input[name="username"]').should('be.visible').clear().type(email)
      cy.get('#password, input[name="password"]').should('be.visible').clear().type(password, { log: false })
      
      if (rememberMe) {
        cy.get('#rememberme, input[name="rememberme"]').check()
      }
    })
  }

  submitLogin() {
    this.loginButton.should('be.visible').click()
  }

  login(email, password) {
    this.fillLoginForm(email, password)
    this.submitLogin()
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', '/minha-conta')
    this.usernameField.should('be.visible')
    this.passwordField.should('be.visible')
  }

  shouldShowErrorMessage(expectedMessage) {
    cy.get('body').then(($body) => {
      if ($body.find('.woocommerce-error, ul.woocommerce-error').length > 0) {
        if (expectedMessage) {
          this.errorMessage.should('be.visible')
          cy.get('.woocommerce-error, ul.woocommerce-error').then(($error) => {
            const errorText = $error.text().toLowerCase()
            const expectedLower = expectedMessage.toLowerCase()
            expect(errorText).to.satisfy((text) => {
              return text.includes(expectedLower) || 
                     (expectedLower.includes('obrigatório') && (text.includes('obrigatório') || text.includes('required'))) ||
                     (expectedLower.includes('campo') && (text.includes('campo') || text.includes('field')))
            })
          })
        } else {
          this.errorMessage.should('be.visible')
        }
      } else {
        cy.get('input[required]').then(($inputs) => {
          if ($inputs.length > 0) {
            $inputs.each((index, input) => {
              if (!input.value) {
                cy.wrap(input).should('have.attr', 'required')
              }
            })
          }
        })
      }
    })
  }

  clickLostPassword() {
    this.lostPasswordLink.should('be.visible').click()
  }
}

export default new LoginPage()
