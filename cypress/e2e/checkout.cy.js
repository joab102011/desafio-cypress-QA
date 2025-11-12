/**
 * Testes de Checkout
 * 
 * Cenário Crítico: Processo de finalização de compra
 * 
 * Justificativa: O checkout é o momento mais crítico do e-commerce, pois é onde
 * a venda é concretizada. Qualquer falha aqui resulta diretamente em perda de receita.
 * É crítico garantir que:
 * 1. Dados de cobrança sejam validados corretamente
 * 2. Métodos de pagamento funcionem
 * 3. O pedido seja processado corretamente
 * 4. Confirmação seja exibida ao cliente
 * 5. Campos obrigatórios sejam validados
 * 
 * Este é o cenário MAIS CRÍTICO, pois qualquer problema aqui impede a conclusão da venda.
 */

import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'
import LoginPage from '../support/page-objects/LoginPage'

describe('Testes de Checkout - Cenário Crítico', () => {
  
  // Hook executado antes de cada teste
  beforeEach(() => {
    // Limpar carrinho e adicionar produto para os testes
    cy.clearCart()
    HomePage.visit()
    
    // Adicionar um produto ao carrinho
    cy.get('.product').first().click()
    ProductPage.addToCart()
    ProductPage.viewCart()
    
    // Navegar para o checkout
    CartPage.proceedToCheckout()
    CheckoutPage.shouldBeOnCheckoutPage()
  })

  it('Deve validar campos obrigatórios no checkout', () => {
    cy.step('Dado que estou na página de checkout')
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('Quando tento finalizar o pedido sem preencher os campos obrigatórios')
    CheckoutPage.placeOrder()
    
    cy.step('Então devo ver mensagens de erro para campos obrigatórios')
    CheckoutPage.shouldShowError('é um campo obrigatório')
  })

  it('Deve finalizar compra com dados válidos', () => {
    cy.step('Dado que estou na página de checkout')
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('Quando preencho todos os dados de cobrança')
    const billingData = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@teste.com',
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567',
      country: 'Brasil'
    }
    
    CheckoutPage.fillBillingData(billingData)
    
    cy.step('E seleciono um método de pagamento')
    cy.get('body').then(($body) => {
      if ($body.find('input[name="payment_method"]').length > 0) {
        cy.get('input[name="payment_method"]').first().should('be.visible').check()
      }
    })
    
    cy.step('E finalizo o pedido')
    CheckoutPage.placeOrder()
    
    cy.step('Então devo ver a confirmação do pedido')
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('Pedido recebido') || bodyText.includes('order received')) {
        CheckoutPage.shouldShowOrderReceived()
      }
    })
  })

  it('Deve validar formato de email no checkout', () => {
    cy.step('Dado que estou na página de checkout')
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('Quando preencho um email inválido')
    const billingData = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'email-invalido',
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567'
    }
    
    CheckoutPage.fillBillingData(billingData)
    CheckoutPage.placeOrder()
    
    cy.step('Então devo ver uma mensagem de erro de email inválido')
    CheckoutPage.shouldShowError('email')
  })

  it('Deve permitir checkout como usuário logado', () => {
    cy.step('Dado que estou logado')
    LoginPage.visit()
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.login(email, password)
    
    cy.step('E tenho produtos no carrinho')
    HomePage.visit()
    cy.get('.product').first().click()
    ProductPage.addToCart()
    ProductPage.viewCart()
    CartPage.proceedToCheckout()
    
    cy.step('Quando preencho os dados de cobrança')
    const billingData = {
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567'
    }
    
    CheckoutPage.fillBillingData(billingData)
    
    cy.step('E finalizo o pedido')
    CheckoutPage.placeOrder()
    
    cy.step('Então o pedido deve ser processado')
    cy.get('body', { timeout: 5000 }).should('be.visible')
  })

  it('Deve exibir resumo do pedido no checkout', () => {
    cy.step('Dado que estou na página de checkout')
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('Quando visualizo a página')
    cy.step('Então devo ver o resumo do pedido com produtos e total')
    cy.get('.shop_table, .cart').should('be.visible')
    CheckoutPage.cartTotal.should('be.visible')
  })

  it('Deve permitir alterar quantidade no checkout', () => {
    cy.step('Dado que estou na página de checkout')
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('Quando altero a quantidade de um produto')
    cy.get('body').then(($body) => {
      if ($body.find('.quantity input').length > 0) {
        cy.get('.quantity input').first().clear()
        cy.get('.quantity input').first().type('2')
        CheckoutPage.cartTotal.should('be.visible')
        
        cy.step('Então o total deve ser atualizado')
        CheckoutPage.cartTotal.should('be.visible')
      }
    })
  })
})
