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
import HomePage from '../support/page-objects/HomePage'

describe('Testes de Login - Cenário Crítico', () => {
  
  // Hook executado antes de cada teste
  beforeEach(() => {
    // Visitar a página de login antes de cada teste
    LoginPage.visit()
  })

  it('Deve realizar login com credenciais válidas', () => {
    // Dado que estou na página de login
    LoginPage.shouldBeOnLoginPage()
    
    // Quando preencho o formulário com credenciais válidas
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    
    LoginPage.login(email, password)
    
    // Então devo ser redirecionado e estar logado
    cy.url().should('not.include', '/minha-conta')
    cy.shouldBeLoggedIn()
  })

  it('Não deve realizar login com email inválido', () => {
    // Dado que estou na página de login
    LoginPage.shouldBeOnLoginPage()
    
    // Quando preencho o formulário com email inválido
    LoginPage.fillLoginForm('email-invalido@teste.com', 'senha123')
    LoginPage.submitLogin()
    
    // Então devo ver uma mensagem de erro
    LoginPage.shouldShowErrorMessage('Endereço de e-mail desconhecido')
  })

  it('Não deve realizar login com senha inválida', () => {
    // Dado que estou na página de login
    LoginPage.shouldBeOnLoginPage()
    
    // Quando preencho o formulário com senha incorreta
    const email = Cypress.env('userEmail')
    LoginPage.fillLoginForm(email, 'senha-incorreta')
    LoginPage.submitLogin()
    
    // Então devo ver uma mensagem de erro
    LoginPage.shouldShowErrorMessage('A senha fornecida para o e-mail')
  })

  it('Deve manter o usuário logado ao marcar "Lembrar-me"', () => {
    // Dado que estou na página de login
    LoginPage.shouldBeOnLoginPage()
    
    // Quando faço login marcando "Lembrar-me"
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    
    LoginPage.fillLoginForm(email, password, true)
    LoginPage.submitLogin()
    
    // Então devo estar logado
    cy.shouldBeLoggedIn()
    
    // E ao fechar e reabrir o navegador, devo continuar logado
    // (Nota: Este teste pode variar dependendo da implementação do site)
    cy.reload()
    cy.shouldBeLoggedIn()
  })

  it('Deve permitir acesso à página de recuperação de senha', () => {
    // Dado que estou na página de login
    LoginPage.shouldBeOnLoginPage()
    
    // Quando clico no link "Esqueceu a senha?"
    LoginPage.clickLostPassword()
    
    // Então devo ser redirecionado para a página de recuperação
    cy.url().should('include', '/lost-password')
    cy.contains('Recuperar senha').should('be.visible')
  })

  it('Deve realizar logout corretamente', () => {
    // Dado que estou logado
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.login(email, password)
    cy.shouldBeLoggedIn()
    
    // Quando clico em logout
    cy.logout()
    
    // Então devo ser redirecionado para a página de login
    LoginPage.shouldBeOnLoginPage()
  })
})

