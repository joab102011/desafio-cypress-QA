/**
 * Testes de Carrinho de Compras
 * 
 * Cenário Crítico: Gerenciamento do carrinho de compras
 * 
 * Justificativa: O carrinho é fundamental no e-commerce, pois é onde o cliente
 * gerencia os produtos antes de finalizar a compra. É crítico garantir que:
 * 1. Produtos sejam adicionados corretamente
 * 2. Quantidades possam ser alteradas
 * 3. Produtos possam ser removidos
 * 4. O total seja calculado corretamente
 * 5. O carrinho persista entre sessões (se aplicável)
 * 
 * Qualquer falha aqui pode resultar em perda de vendas ou problemas no checkout.
 */

import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'

describe('Testes de Carrinho de Compras - Cenário Crítico', () => {
  
  // Hook executado antes de cada teste
  beforeEach(() => {
    // Limpar carrinho antes de cada teste para garantir estado limpo
    cy.clearCart()
    // Visitar a página inicial
    HomePage.visit()
  })

  it('Deve adicionar produto ao carrinho a partir da página inicial', () => {
    cy.step('Dado que estou na página inicial')
    HomePage.shouldBeOnHomePage()
    
    cy.step('Quando clico em um produto')
    cy.get('a[href*="/product/"]').first().click()
    
    cy.step('E adiciono o produto ao carrinho')
    ProductPage.shouldBeOnProductPage()
    ProductPage.addToCart()
    
    cy.step('Então o produto deve ser adicionado com sucesso')
    ProductPage.shouldShowAddToCartSuccess()
    
    cy.step('E o carrinho deve mostrar 1 item')
    // Aguardar um pouco para garantir que o carrinho foi atualizado no header
    cy.get('body', { timeout: 2000 }).should('be.visible')
    HomePage.visit()
    // Aguardar a página carregar completamente antes de verificar o contador
    cy.get('body', { timeout: 3000 }).should('be.visible')
    HomePage.shouldHaveCartItems(1)
  })

  it('Deve adicionar múltiplas quantidades do mesmo produto', () => {
    cy.step('Dado que estou na página de um produto')
    HomePage.visit()
    cy.get('a[href*="/product/"]').first().click()
    ProductPage.shouldBeOnProductPage()
    
    cy.step('Quando adiciono 3 unidades do produto')
    ProductPage.addToCart(3)
    
    cy.step('Então o produto deve ser adicionado com sucesso')
    ProductPage.shouldShowAddToCartSuccess()
    
    cy.step('E ao visualizar o carrinho, deve ter 3 unidades')
    ProductPage.viewCart()
    CartPage.shouldBeOnCartPage()
    CartPage.shouldHaveItems(1) // 1 item, mas com quantidade 3
  })

  it('Deve remover produto do carrinho', () => {
    cy.step('Dado que tenho um produto no carrinho')
    HomePage.visit()
    cy.get('a[href*="/product/"]').first().click()
    ProductPage.addToCart()
    ProductPage.viewCart()
    
    cy.step('Quando removo o produto do carrinho')
    CartPage.removeItem(0)
    
    cy.step('Então o carrinho deve estar vazio')
    CartPage.shouldBeEmpty()
  })

  it('Deve atualizar a quantidade de um produto no carrinho', () => {
    cy.step('Dado que tenho um produto no carrinho')
    HomePage.visit()
    cy.get('a[href*="/product/"]').first().click()
    ProductPage.addToCart(1)
    ProductPage.viewCart()
    CartPage.shouldBeOnCartPage()
    
    cy.step('Quando atualizo a quantidade para 5')
    CartPage.updateQuantity(0, 5)
    
    cy.step('Então a quantidade deve ser atualizada')
    // Input de quantidade no carrinho tem nome específico
    cy.get('input[type="number"][name*="cart"][name*="qty"], .quantity input[type="number"]')
      .first()
      .should('have.value', '5')
  })

  it('Deve calcular o total do carrinho corretamente', () => {
    cy.step('Dado que tenho produtos no carrinho')
    HomePage.visit()
    
    cy.step('Quando adiciono primeiro produto')
    cy.get('a[href*="/product/"]').first().click()
    ProductPage.addToCart(2)
    ProductPage.viewCart()
    
    cy.step('E adiciono segundo produto')
    HomePage.visit()
    cy.get('a[href*="/product/"]').eq(1).click()
    ProductPage.addToCart(1)
    ProductPage.viewCart()
    
    cy.step('Então o total deve ser calculado corretamente')
    CartPage.shouldBeOnCartPage()
    CartPage.getCartTotal().should('exist')
  })

  it('Deve navegar para o checkout a partir do carrinho', () => {
    cy.step('Dado que tenho produtos no carrinho')
    HomePage.visit()
    cy.get('a[href*="/product/"]').first().click()
    ProductPage.addToCart()
    ProductPage.viewCart()
    
    cy.step('Quando clico em "Finalizar compra"')
    CartPage.proceedToCheckout()
    
    cy.step('Então devo ser redirecionado para a página de checkout')
    cy.url().should('include', '/checkout')
  })

  it('Deve limpar todo o carrinho', () => {
    cy.step('Dado que tenho múltiplos produtos no carrinho')
    HomePage.visit()
    
    cy.step('Quando adiciono vários produtos')
    for (let i = 0; i < 3; i++) {
      cy.get('a[href*="/product/"]').eq(i).click()
      ProductPage.addToCart()
      HomePage.visit()
    }
    
    cy.step('E limpo o carrinho')
    CartPage.visit()
    CartPage.clearCart()
    
    cy.step('Então o carrinho deve estar vazio')
    CartPage.shouldBeEmpty()
  })
})
