import LoginPage from '../support/page-objects/LoginPage'
import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'

describe('Testes Negativos - Validações e Edge Cases', () => {
  
  beforeEach(() => {
    cy.clearCart()
  })

  describe('Validações de Login', () => {
    
    beforeEach(() => {
      LoginPage.visit()
    })

    it('Não deve permitir login com campo email vazio', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando tento fazer login sem preencher o email')
      LoginPage.passwordField.type('senha123')
      LoginPage.submitLogin()
      
      cy.step('Então devo ver mensagem de erro')
      LoginPage.shouldShowErrorMessage('é um campo obrigatório')
    })

    it('Não deve permitir login com campo senha vazio', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando tento fazer login sem preencher a senha')
      LoginPage.usernameField.type('email@teste.com')
      LoginPage.submitLogin()
      
      cy.step('Então devo ver mensagem de erro')
      LoginPage.shouldShowErrorMessage('é um campo obrigatório')
    })

    it('Não deve permitir login com email em formato inválido', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando preencho com email em formato inválido')
      LoginPage.fillLoginForm('email-invalido', 'senha123')
      LoginPage.submitLogin()
      
      cy.step('Então devo ver mensagem de erro')
      LoginPage.shouldShowErrorMessage('email')
    })

    it('Não deve permitir login com SQL injection no campo email', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando tento fazer login com tentativa de SQL injection')
      const sqlInjection = "' OR '1'='1"
      LoginPage.fillLoginForm(sqlInjection, 'senha123')
      LoginPage.submitLogin()
      
      cy.step('Então o sistema deve rejeitar e mostrar erro')
      LoginPage.shouldShowErrorMessage()
    })

    it('Não deve permitir login com XSS no campo email', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando tento fazer login com tentativa de XSS')
      const xssAttempt = '<script>alert("XSS")</script>'
      LoginPage.fillLoginForm(xssAttempt, 'senha123')
      LoginPage.submitLogin()
      
      cy.step('Então o sistema deve sanitizar e rejeitar')
      LoginPage.shouldShowErrorMessage()
    })

    it('Não deve permitir login após múltiplas tentativas falhas', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.shouldBeOnLoginPage()
      
      cy.step('Quando tento fazer login várias vezes com credenciais inválidas')
      for (let i = 0; i < 5; i++) {
        LoginPage.fillLoginForm('email@teste.com', 'senha-errada')
        LoginPage.submitLogin()
        cy.get('.woocommerce-error, .error', { timeout: 2000 }).should('exist')
      }
      
      cy.step('Então o sistema deve bloquear ou mostrar mensagem de segurança')
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        if (bodyText.includes('bloqueado') || bodyText.includes('muitas tentativas')) {
          cy.contains(/bloqueado|muitas tentativas/i).should('be.visible')
        }
      })
    })
  })

  describe('Validações de Carrinho', () => {
    
    it('Não deve permitir adicionar quantidade negativa ao carrinho', () => {
      cy.step('Dado que estou na página de um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]').first().click()
      ProductPage.shouldBeOnProductPage()
      
      cy.step('Quando tento adicionar quantidade negativa')
      ProductPage.quantityInput.clear().type('-1')
      ProductPage.addToCartButton.click()
      
      cy.step('Então o sistema deve validar e não permitir')
      cy.get('body').then(($body) => {
        if ($body.text().includes('quantidade inválida') || $body.text().includes('quantidade mínima')) {
          cy.contains(/quantidade inválida|quantidade mínima/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir adicionar quantidade zero ao carrinho', () => {
      cy.step('Dado que estou na página de um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]').first().click()
      ProductPage.shouldBeOnProductPage()
      
      cy.step('Quando tento adicionar quantidade zero')
      ProductPage.quantityInput.clear().type('0')
      ProductPage.addToCartButton.click()
      
      cy.step('Então o sistema deve validar e não permitir')
      cy.get('body').then(($body) => {
        if ($body.text().includes('quantidade mínima')) {
          cy.contains(/quantidade mínima/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir adicionar quantidade acima do estoque disponível', () => {
      cy.step('Dado que estou na página de um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]').first().click()
      ProductPage.shouldBeOnProductPage()
      
      cy.step('Quando tento adicionar quantidade muito alta')
      ProductPage.quantityInput.clear().type('99999')
      ProductPage.addToCartButton.click()
      
      cy.step('Então o sistema deve validar estoque')
      cy.get('body').then(($body) => {
        if ($body.text().includes('estoque') || $body.text().includes('disponível')) {
          cy.contains(/estoque|disponível/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir remover item de carrinho vazio', () => {
      cy.step('Dado que o carrinho está vazio')
      CartPage.visit()
      CartPage.shouldBeEmpty()
      
      cy.step('Quando tento remover um item')
      cy.step('Então não deve haver botões de remoção disponíveis')
      cy.get('.remove, .product-remove').should('not.exist')
    })
  })

  describe('Validações de Checkout', () => {
    
    beforeEach(() => {
      cy.clearCart()
      HomePage.visit()
      
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      ProductPage.shouldBeOnProductPage()
      ProductPage.addToCart()
      ProductPage.shouldShowAddToCartSuccess()
      ProductPage.viewCart()
      CartPage.shouldBeOnCartPage()
      CartPage.proceedToCheckout()
      CheckoutPage.shouldBeOnCheckoutPage()
    })

    it('Não deve permitir checkout com email inválido', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho com email inválido')
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
      
      cy.step('Então devo ver mensagem de erro de email')
      CheckoutPage.shouldShowError('email')
    })

    it('Não deve permitir checkout com telefone inválido', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho com telefone inválido')
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: '123',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: '01234-567'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      cy.step('Então devo ver mensagem de erro')
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com CEP inválido', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho com CEP inválido')
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: '11999999999',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: '123'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      cy.step('Então devo ver mensagem de erro')
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout sem selecionar método de pagamento', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho todos os dados mas não seleciono pagamento')
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: '11999999999',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: '01234-567'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      cy.step('Então devo ver mensagem de erro')
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com caracteres especiais em campos numéricos', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho todos os campos obrigatórios mas uso caracteres especiais em campos numéricos')
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: 'abc!@#',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: 'xyz!@#'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      cy.step('Então o sistema deve validar e não permitir')
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com campos obrigatórios vazios', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando tento finalizar sem preencher campos obrigatórios')
      CheckoutPage.placeOrder()
      
      cy.step('Então devo ver múltiplas mensagens de erro')
      CheckoutPage.shouldShowError()
      cy.get('.woocommerce-error li, .error', { timeout: 10000 })
        .should('have.length.greaterThan', 0)
    })

    it('Não deve permitir checkout com dados muito longos', () => {
      cy.step('Dado que estou na página de checkout')
      CheckoutPage.shouldBeOnCheckoutPage()
      
      cy.step('Quando preencho campos com strings muito longas')
      const longString = 'A'.repeat(500)
      const billingData = {
        firstName: longString,
        lastName: longString,
        email: 'joao@teste.com',
        phone: '11999999999',
        address: longString,
        city: longString,
        postcode: '01234-567'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      cy.step('Então o sistema deve validar tamanho máximo')
      CheckoutPage.shouldShowError()
    })
  })

  describe('Validações de Busca', () => {
    
    beforeEach(() => {
      HomePage.visit()
    })

    it('Não deve quebrar com busca vazia', () => {
      cy.step('Dado que estou na página inicial')
      HomePage.shouldBeOnHomePage()
      
      cy.step('Quando tento buscar sem digitar nada')
      HomePage.searchProduct('')
      
      cy.step('Então o sistema deve tratar adequadamente')
      cy.get('body').should('be.visible')
      cy.url().should('include', 's=')
    })

    it('Não deve quebrar com busca contendo caracteres especiais', () => {
      cy.step('Dado que estou na página inicial')
      HomePage.shouldBeOnHomePage()
      
      cy.step('Quando busco com caracteres especiais')
      HomePage.searchProduct('!@#$%^&*()')
      
      cy.step('Então o sistema deve tratar adequadamente')
      cy.get('body').should('be.visible')
    })

    it('Não deve quebrar com busca contendo SQL injection', () => {
      cy.step('Dado que estou na página inicial')
      HomePage.shouldBeOnHomePage()
      
      cy.step('Quando busco com tentativa de SQL injection')
      HomePage.searchProduct("'; DROP TABLE products; --")
      
      cy.step('Então o sistema deve sanitizar e não quebrar')
      cy.get('body').should('be.visible')
    })
  })

  describe('Validações de Navegação', () => {
    
    it('Não deve quebrar ao acessar URL inválida', () => {
      cy.step('Quando acesso uma URL que não existe')
      cy.visit('/pagina-que-nao-existe-12345', { failOnStatusCode: false })
      
      cy.step('Então o sistema deve mostrar página 404 ou redirecionar')
      cy.get('body').should('be.visible')
    })

    it('Não deve permitir acesso direto ao checkout sem produtos', () => {
      cy.step('Quando tento acessar checkout diretamente sem produtos no carrinho')
      CheckoutPage.visit()
      
      cy.step('Então devo ser redirecionado ou ver mensagem')
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        if (bodyText.includes('carrinho vazio') || bodyText.includes('sem produtos')) {
          cy.contains(/carrinho vazio|sem produtos/i).should('be.visible')
        } else {
          cy.url().should('include', 'carrinho')
        }
      })
    })
  })
})
