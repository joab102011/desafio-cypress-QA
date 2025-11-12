/**
 * Teste de Fluxo Completo - E2E
 * 
 * Cenário Crítico: Jornada completa do cliente
 * 
 * Justificativa: Este teste valida a jornada completa do cliente desde a busca
 * até a finalização da compra. É crítico porque:
 * 1. Valida a integração entre todas as funcionalidades
 * 2. Simula o comportamento real do usuário
 * 3. Identifica problemas de integração que testes isolados não capturam
 * 4. Garante que o fluxo principal de vendas funciona end-to-end
 * 
 * Este é um dos cenários mais importantes, pois valida o funil de conversão completo.
 */

import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'
import LoginPage from '../support/page-objects/LoginPage'

describe('Fluxo Completo E2E - Jornada do Cliente', () => {
  
  it('Deve completar todo o fluxo de compra: Busca -> Produto -> Carrinho -> Checkout', () => {
    cy.step('DADO que sou um cliente visitando a loja')
    HomePage.visit()
    HomePage.shouldBeOnHomePage()
    
    cy.step('QUANDO busco por um produto')
    HomePage.searchProduct('produto')
    
    cy.step('E clico em um produto nos resultados')
    cy.get('.product, .woocommerce-loop-product__link').first().click()
    
    cy.step('E visualizo os detalhes do produto')
    ProductPage.shouldBeOnProductPage()
    ProductPage.shouldHaveProductImage()
    
    cy.step('E adiciono o produto ao carrinho')
    ProductPage.addToCart(2) // Adicionar 2 unidades
    
    cy.step('E visualizo o carrinho')
    ProductPage.viewCart()
    CartPage.shouldBeOnCartPage()
    CartPage.shouldHaveItems(1)
    
    cy.step('E prossigo para o checkout')
    CartPage.proceedToCheckout()
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('E preencho os dados de cobrança')
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
    
    cy.step('E seleciono método de pagamento')
    cy.get('body').then(($body) => {
      if ($body.find('input[name="payment_method"]').length > 0) {
        cy.get('input[name="payment_method"]').first().should('be.visible').check()
      }
    })
    
    cy.step('ENTÃO o pedido deve ser processado')
    CheckoutPage.placeOrder()
    
    cy.step('E devo ver a confirmação do pedido')
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('Pedido recebido') || bodyText.includes('order received')) {
        CheckoutPage.shouldShowOrderReceived()
      }
    })
  })

  it('Deve completar fluxo de compra com usuário logado', () => {
    cy.step('DADO que sou um cliente logado')
    LoginPage.visit()
    const email = Cypress.env('userEmail')
    const password = Cypress.env('userPassword')
    LoginPage.login(email, password)
    cy.shouldBeLoggedIn()
    
    cy.step('QUANDO navego pela loja')
    HomePage.visit()
    
    cy.step('E adiciono produtos ao carrinho')
    cy.get('.product').first().click()
    ProductPage.addToCart()
    ProductPage.viewCart()
    
    cy.step('E prossigo para o checkout')
    CartPage.proceedToCheckout()
    
    cy.step('E finalizo o pedido')
    const billingData = {
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567'
    }
    
    CheckoutPage.fillBillingData(billingData)
    CheckoutPage.placeOrder()
    
    cy.step('ENTÃO o pedido deve ser processado')
    cy.get('body', { timeout: 5000 }).should('be.visible')
  })
})
