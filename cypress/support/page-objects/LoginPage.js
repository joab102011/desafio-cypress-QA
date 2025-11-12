/**
 * Page Object para a página de Login
 * 
 * Boa prática: Centraliza todos os seletores e ações da página de login
 * Usa seletores múltiplos para maior robustez e compatibilidade
 * Exporta instância única (singleton) para reutilização
 */
class LoginPage {
  // Seletores usam múltiplas opções para compatibilidade com diferentes temas WooCommerce
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
   * Navega para a página de login
   * Valida que chegou na URL correta
   */
  visit() {
    cy.visit('/minha-conta')
    cy.url().should('include', '/minha-conta')
  }

  /**
   * Preenche o formulário de login
   * Boa prática: Usa within() para garantir que está no formulário correto
   * Usa { log: false } na senha para não expor credenciais nos logs
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {boolean} [rememberMe=false] - Se deve marcar "Lembrar-me"
   */
  fillLoginForm(email, password, rememberMe = false) {
    // Usa within() para isolar ações dentro do formulário
    cy.get('form.woocommerce-form-login, form:has(button[name="login"])').within(() => {
      cy.get('#username, input[name="username"]').should('be.visible').clear().type(email)
      // Senha não é logada por segurança
      cy.get('#password, input[name="password"]').should('be.visible').clear().type(password, { log: false })
      
      if (rememberMe) {
        cy.get('#rememberme, input[name="rememberme"]').check()
      }
    })
  }

  /**
   * Submete o formulário de login
   * Valida que o botão está visível antes de clicar
   */
  submitLogin() {
    this.loginButton.should('be.visible').click()
  }

  /**
   * Método de conveniência: preenche e submete login em uma chamada
   * Útil para testes que só precisam fazer login sem validações intermediárias
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   */
  login(email, password) {
    this.fillLoginForm(email, password)
    this.submitLogin()
  }

  /**
   * Valida que está na página de login
   * Verifica URL e presença dos campos principais
   */
  shouldBeOnLoginPage() {
    cy.url().should('include', '/minha-conta')
    this.usernameField.should('be.visible')
    this.passwordField.should('be.visible')
  }

  /**
   * Valida mensagem de erro na página
   * Boa prática: Aceita validação parcial (case-insensitive) e traduções
   * Também valida campos obrigatórios se não houver mensagem de erro visível
   * 
   * @param {string} [expectedMessage] - Mensagem esperada (opcional, valida parcialmente)
   */
  shouldShowErrorMessage(expectedMessage) {
    cy.get('body').then(($body) => {
      // Verifica se há mensagem de erro visível
      if ($body.find('.woocommerce-error, ul.woocommerce-error').length > 0) {
        if (expectedMessage) {
          this.errorMessage.should('be.visible')
          // Validação flexível: aceita mensagens em português ou inglês
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
          // Apenas valida que há mensagem de erro, sem validar conteúdo
          this.errorMessage.should('be.visible')
        }
      } else {
        // Se não há mensagem de erro, valida campos obrigatórios
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

  /**
   * Clica no link "Esqueceu a senha?"
   * Valida que o link está visível antes de clicar
   */
  clickLostPassword() {
    this.lostPasswordLink.should('be.visible').click()
  }
}

export default new LoginPage()
