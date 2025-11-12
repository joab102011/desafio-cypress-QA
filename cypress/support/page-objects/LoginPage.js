/**
 * Page Object para a página de Login
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de login.
 * Seletores ajustados baseados na estrutura real do site http://lojaebac.ebaconline.art.br
 */

class LoginPage {
  // Seletores da página de login - baseados na estrutura real
  // Usar contexto do formulário de login para evitar conflito com formulário de registro
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

  /**
   * Visita a página de login
   */
  visit() {
    cy.visit('/minha-conta')
    cy.url().should('include', '/minha-conta')
  }

  /**
   * Preenche o formulário de login
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {boolean} rememberMe - Se deve marcar "Lembrar-me"
   */
  fillLoginForm(email, password, rememberMe = false) {
    // Usar seletor mais específico para o formulário de login
    cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
      cy.get('#username, input[name="username"]').should('be.visible').clear().type(email)
      cy.get('#password, input[name="password"]').should('be.visible').clear().type(password, { log: false })
      
      if (rememberMe) {
        cy.get('#rememberme, input[name="rememberme"]').check()
      }
    })
  }

  /**
   * Submete o formulário de login
   */
  submitLogin() {
    this.loginButton.should('be.visible').click()
  }

  /**
   * Realiza login completo
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   */
  login(email, password) {
    this.fillLoginForm(email, password)
    this.submitLogin()
  }

  /**
   * Verifica se está na página de login
   */
  shouldBeOnLoginPage() {
    cy.url().should('include', '/minha-conta')
    this.usernameField.should('be.visible')
    this.passwordField.should('be.visible')
  }

  /**
   * Verifica mensagem de erro
   * @param {string} expectedMessage - Mensagem esperada (opcional)
   */
  shouldShowErrorMessage(expectedMessage) {
    cy.get('body').then(($body) => {
      if ($body.find('.woocommerce-error, ul.woocommerce-error').length > 0) {
        if (expectedMessage) {
          this.errorMessage.should('be.visible').and('contain', expectedMessage)
        } else {
          this.errorMessage.should('be.visible')
        }
      }
    })
  }

  /**
   * Clica no link de recuperar senha
   */
  clickLostPassword() {
    this.lostPasswordLink.should('be.visible').click()
  }
}

export default new LoginPage()
