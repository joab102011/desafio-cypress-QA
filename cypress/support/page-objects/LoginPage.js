/**
 * Page Object para a página de Login
 * 
 * Este arquivo contém os seletores e métodos relacionados à página de login.
 * Seguindo a recomendação do entrevistador de organizar por Page Objects
 * sem usar muita herança desnecessária.
 */

class LoginPage {
  // Seletores da página de login
  get usernameField() {
    return cy.get('#username')
  }

  get passwordField() {
    return cy.get('#password')
  }

  get loginButton() {
    return cy.get('[name="login"]')
  }

  get rememberMeCheckbox() {
    return cy.get('#rememberme')
  }

  get lostPasswordLink() {
    return cy.get('.lost_password a')
  }

  get errorMessage() {
    return cy.get('.woocommerce-error')
  }

  get successMessage() {
    return cy.get('.woocommerce-message')
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
    this.usernameField.should('be.visible').clear().type(email)
    this.passwordField.should('be.visible').clear().type(password, { log: false })
    
    if (rememberMe) {
      this.rememberMeCheckbox.check()
    }
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
   * @param {string} expectedMessage - Mensagem esperada
   */
  shouldShowErrorMessage(expectedMessage) {
    this.errorMessage.should('be.visible').and('contain', expectedMessage)
  }

  /**
   * Clica no link de recuperar senha
   */
  clickLostPassword() {
    this.lostPasswordLink.should('be.visible').click()
  }
}

export default new LoginPage()

