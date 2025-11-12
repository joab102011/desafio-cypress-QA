/**
 * Testes de Login
 * 
 * Cenário Crítico: Autenticação de usuário
 * 
 * Justificativa: O login é o ponto de entrada para todas as funcionalidades
 * que requerem autenticação. É crítico garantir que:
 * 1. Usuários válidos possam fazer login
 * 2. Usuários inválidos sejam bloqueados
 * 3. A sessão seja mantida corretamente
 * 4. O logout funcione adequadamente
 * 
 * Este é um cenário crítico porque qualquer falha aqui impede o acesso
 * a funcionalidades essenciais do e-commerce como checkout, histórico de pedidos, etc.
 */

import LoginPage from '../support/page-objects/LoginPage'

describe('Testes de Login - Cenário Crítico', () => {
  
  // Hook executado antes de cada teste
  beforeEach(() => {
    // Visitar a página de login antes de cada teste
    LoginPage.visit()
  })

  it('Deve realizar login com credenciais válidas', () => {
    cy.step('Dado que estou na página de login')
    LoginPage.shouldBeOnLoginPage()
    
    cy.step('Quando preencho o formulário com credenciais válidas')
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.login(email, password)
    
    cy.step('Então devo ser redirecionado e estar logado')
    cy.url().should('not.include', '/minha-conta')
    cy.shouldBeLoggedIn()
  })

  it('Não deve realizar login com email inválido', () => {
    cy.step('Dado que estou na página de login')
    LoginPage.shouldBeOnLoginPage()
    
    cy.step('Quando preencho o formulário com email inválido')
    LoginPage.fillLoginForm('email-invalido@teste.com', 'senha123')
    LoginPage.submitLogin()
    
    cy.step('Então devo ver uma mensagem de erro')
    LoginPage.shouldShowErrorMessage('Endereço de e-mail desconhecido')
  })

  it('Não deve realizar login com senha inválida', () => {
    cy.step('Dado que estou na página de login')
    LoginPage.shouldBeOnLoginPage()
    
    cy.step('Quando preencho o formulário com senha incorreta')
    const email = Cypress.env('userEmail')
    LoginPage.fillLoginForm(email, 'senha-incorreta')
    LoginPage.submitLogin()
    
    cy.step('Então devo ver uma mensagem de erro')
    LoginPage.shouldShowErrorMessage('A senha fornecida para o e-mail')
  })

  it('Deve manter o usuário logado ao marcar "Lembrar-me"', () => {
    cy.step('Dado que estou na página de login')
    LoginPage.shouldBeOnLoginPage()
    
    cy.step('Quando faço login marcando "Lembrar-me"')
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.fillLoginForm(email, password, true)
    LoginPage.submitLogin()
    
    cy.step('Então devo estar logado')
    cy.shouldBeLoggedIn()
    
    cy.step('E ao recarregar a página, devo continuar logado')
    cy.reload()
    cy.shouldBeLoggedIn()
  })

  it('Deve permitir acesso à página de recuperação de senha', () => {
    cy.step('Dado que estou na página de login')
    LoginPage.shouldBeOnLoginPage()
    
    cy.step('Quando clico no link "Esqueceu a senha?"')
    LoginPage.clickLostPassword()
    
    cy.step('Então devo ser redirecionado para a página de recuperação')
    cy.url().should('include', '/lost-password')
    cy.contains('Recuperar senha').should('be.visible')
  })

  it('Deve realizar logout corretamente', () => {
    cy.step('Dado que estou logado')
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.login(email, password)
    cy.shouldBeLoggedIn()
    
    cy.step('Quando clico em logout')
    cy.logout()
    
    cy.step('Então devo ser redirecionado para a página de login')
    LoginPage.shouldBeOnLoginPage()
  })
})
