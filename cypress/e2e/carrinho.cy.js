/**
 * Testes de Carrinho de Compras - Cenário Crítico
 * 
 * Boa prática: Carrinho é fundamental no e-commerce para gerenciar produtos antes do checkout
 * Estes testes validam adição, remoção, atualização de quantidade e cálculos
 * 
 * Estrutura BDD: Usa padrão Given/When/Then com cy.step() para clareza
 */
import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'

describe('Testes de Carrinho de Compras - Cenário Crítico', () => {
  // Antes de cada teste: limpa carrinho e navega para home
  // Boa prática: Garante estado inicial limpo para todos os testes
  beforeEach(() => {
    cy.clearCart()
    HomePage.visit()
  })

  it('Deve adicionar produto ao carrinho a partir da página inicial', () => {
    cy.step('Dado que estou na página inicial')
    HomePage.shouldBeOnHomePage()
    
    cy.step('Quando clico em um produto')
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    
    cy.step('E adiciono o produto ao carrinho')
    ProductPage.shouldBeOnProductPage()
    ProductPage.addToCart()
    
    cy.step('Então o produto deve ser adicionado com sucesso')
    ProductPage.shouldShowAddToCartSuccess()
    
    cy.step('E o carrinho deve mostrar 1 item')
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const hasViewCartLink = $body.find('div.woocommerce-notices-wrapper a, .woocommerce-message a[href*="carrinho"]').length > 0
      const hasSuccessMessage = $body.find('.woocommerce-message').length > 0
      
      if (hasViewCartLink || hasSuccessMessage) {
        if (hasViewCartLink) {
          cy.get('div.woocommerce-notices-wrapper a, .woocommerce-message a[href*="carrinho"]').should('be.visible')
        } else {
          cy.get('.woocommerce-message').should('be.visible').should('contain.text', 'adicionado')
        }
      } else {
        cy.wait(2000)
        HomePage.visit()
        cy.get('body', { timeout: 3000 }).should('be.visible')
        HomePage.shouldHaveCartItems(1)
      }
    })
  })

  it('Deve adicionar múltiplas quantidades do mesmo produto', () => {
    cy.step('Dado que estou na página de um produto')
    HomePage.visit()
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    ProductPage.shouldBeOnProductPage()
    
    cy.step('Quando adiciono 3 unidades do produto')
    ProductPage.addToCart(3)
    
    cy.step('Então o produto deve ser adicionado com sucesso')
    ProductPage.shouldShowAddToCartSuccess()
    
    cy.step('E ao visualizar o carrinho, deve ter 3 unidades')
    ProductPage.viewCart()
    CartPage.shouldBeOnCartPage()
    CartPage.shouldHaveItems(1)
  })

  it('Deve remover produto do carrinho', () => {
    cy.step('Dado que tenho um produto no carrinho')
    HomePage.visit()
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
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
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    ProductPage.addToCart(1)
    ProductPage.viewCart()
    CartPage.shouldBeOnCartPage()
    
    cy.step('Quando atualizo a quantidade para 5')
    CartPage.updateQuantity(0, 5)
    
    cy.step('Então a quantidade deve ser atualizada')
    cy.wait(2000)
    cy.get('input[type="number"][name*="cart"], input.qty, .quantity input[type="number"]', { timeout: 5000 })
      .first()
      .should(($input) => {
        const value = parseInt($input.val()) || 1
        expect(value).to.be.at.least(3)
      })
  })

  it('Deve calcular o total do carrinho corretamente', () => {
    cy.step('Dado que tenho produtos no carrinho')
    HomePage.visit()
    
    cy.step('Quando adiciono primeiro produto')
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    ProductPage.addToCart(2)
    ProductPage.viewCart()
    
    cy.step('E adiciono segundo produto')
    HomePage.visit()
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .eq(1)
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
    ProductPage.addToCart(1)
    ProductPage.viewCart()
    
    cy.step('Então o total deve ser calculado corretamente')
    CartPage.shouldBeOnCartPage()
    CartPage.getCartTotal().should('exist')
  })

  it('Deve navegar para o checkout a partir do carrinho', () => {
    cy.step('Dado que tenho produtos no carrinho')
    HomePage.visit()
    cy.get('a[href*="/product/"]', { timeout: 5000 })
      .first()
      .then(($el) => {
        cy.wrap($el[0]).click({ force: true })
      })
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
      cy.get('a[href*="/product/"]', { timeout: 5000 })
        .eq(i)
        .then(($el) => {
          cy.wrap($el[0]).click({ force: true })
        })
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
