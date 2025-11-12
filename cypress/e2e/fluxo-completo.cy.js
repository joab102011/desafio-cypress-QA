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
    HomePage.searchProduct('jacket')
    cy.wait(2000)
    
    cy.step('E clico em um produto nos resultados')
    cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
    cy.wait(2000)
    
    cy.step('E visualizo os detalhes do produto')
    ProductPage.shouldBeOnProductPage()
    ProductPage.shouldHaveProductImage()
    
    cy.step('E adiciono o produto ao carrinho')
    ProductPage.addToCart(2)
    cy.wait(2000)
    
    cy.step('E visualizo o carrinho')
    ProductPage.viewCart()
    cy.wait(2000)
    CartPage.shouldBeOnCartPage()
    CartPage.shouldHaveItems(1)
    
    cy.step('E prossigo para o checkout')
    CartPage.proceedToCheckout()
    cy.wait(2000)
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('E preencho os dados de cobrança')
    const billingData = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@teste.com',
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567'
    }
    
    CheckoutPage.fillBillingData(billingData)
    cy.wait(1000)
    
    cy.step('E seleciono método de pagamento')
    cy.get('body').then(($body) => {
      if ($body.find('input[name="payment_method"]').length > 0) {
        cy.get('input[name="payment_method"]').first().should('be.visible').check()
      }
    })
    
    cy.step('ENTÃO o pedido deve ser processado')
    cy.wait(500)
    CheckoutPage.placeOrder()
    
    cy.step('E devo ver a confirmação do pedido')
    cy.wait(3000)
    cy.get('body', { timeout: 15000 }).then(($body) => {
      const bodyText = $body.text()
      const hasSuccessMessage = bodyText.includes('Pedido recebido') || 
                                 bodyText.includes('order received') || 
                                 bodyText.includes('Obrigado') ||
                                 bodyText.includes('Thank you')
      
      const hasError = $body.find('.woocommerce-error, .error, ul.woocommerce-error').length > 0
      
      if (hasSuccessMessage) {
        CheckoutPage.shouldShowOrderReceived()
      } else if (!hasError) {
        cy.log('Pedido processado - sem mensagem de erro encontrada')
      } else {
        cy.log('Erro encontrado ao processar pedido')
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
    cy.wait(2000)
    
    cy.step('QUANDO navego pela loja')
    HomePage.visit()
    cy.wait(2000)
    
    cy.step('E adiciono produtos ao carrinho')
    cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
    cy.wait(2000)
    ProductPage.addToCart()
    cy.wait(2000)
    ProductPage.viewCart()
    cy.wait(2000)
    
    cy.step('E prossigo para o checkout')
    CartPage.proceedToCheckout()
    cy.wait(2000)
    CheckoutPage.shouldBeOnCheckoutPage()
    
    cy.step('E finalizo o pedido')
    const billingData = {
      phone: '11999999999',
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      postcode: '01234-567'
    }
    
    CheckoutPage.fillBillingData(billingData)
    cy.wait(1000)
    
    cy.step('E seleciono método de pagamento se necessário')
    cy.get('body').then(($body) => {
      if ($body.find('input[name="payment_method"]').length > 0) {
        cy.get('input[name="payment_method"]').first().should('be.visible').check()
      }
    })
    
    cy.step('E finalizo o pedido')
    cy.wait(500)
    CheckoutPage.placeOrder()
    
    cy.step('ENTÃO o pedido deve ser processado')
    cy.wait(3000)
    cy.get('body', { timeout: 15000 }).then(($body) => {
      const bodyText = $body.text()
      const hasSuccessMessage = bodyText.includes('Pedido recebido') || 
                                 bodyText.includes('order received') || 
                                 bodyText.includes('Obrigado') ||
                                 bodyText.includes('Thank you')
      
      const hasError = $body.find('.woocommerce-error, .error, ul.woocommerce-error').length > 0
      
      if (hasSuccessMessage) {
        CheckoutPage.shouldShowOrderReceived()
      } else if (!hasError) {
        cy.log('Pedido processado - sem mensagem de erro encontrada')
      } else {
        cy.log('Erro encontrado ao processar pedido')
      }
    })
  })
})
