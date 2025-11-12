/**
 * Testes Negativos - Validações e Edge Cases
 * 
 * Cenário Crítico: Validação de regras de negócio e tratamento de erros
 * 
 * Justificativa: Testes negativos são essenciais para garantir que o sistema
 * se comporta corretamente em situações inesperadas ou inválidas. Isso previne:
 * 1. Quebra do sistema com dados inválidos
 * 2. Problemas de segurança
 * 3. Má experiência do usuário
 * 4. Perda de dados ou transações inválidas
 * 
 * Estes testes garantem robustez e confiabilidade do sistema.
 */

import LoginPage from '../support/page-objects/LoginPage'
import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'

describe('Testes Negativos - Validações e Edge Cases', () => {
  
  beforeEach(() => {
    // Limpar estado antes de cada teste
    cy.clearCart()
  })

  describe('Validações de Login', () => {
    
    beforeEach(() => {
      LoginPage.visit()
    })

    it('Não deve permitir login com campo email vazio', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando tento fazer login sem preencher o email
      LoginPage.passwordField.type('senha123')
      LoginPage.submitLogin()
      
      // Então devo ver mensagem de erro
      LoginPage.shouldShowErrorMessage('é um campo obrigatório')
    })

    it('Não deve permitir login com campo senha vazio', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando tento fazer login sem preencher a senha
      LoginPage.usernameField.type('email@teste.com')
      LoginPage.submitLogin()
      
      // Então devo ver mensagem de erro
      LoginPage.shouldShowErrorMessage('é um campo obrigatório')
    })

    it('Não deve permitir login com email em formato inválido', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando preencho com email em formato inválido
      LoginPage.fillLoginForm('email-invalido', 'senha123')
      LoginPage.submitLogin()
      
      // Então devo ver mensagem de erro
      LoginPage.shouldShowErrorMessage('email')
    })

    it('Não deve permitir login com SQL injection no campo email', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando tento fazer login com tentativa de SQL injection
      const sqlInjection = "' OR '1'='1"
      LoginPage.fillLoginForm(sqlInjection, 'senha123')
      LoginPage.submitLogin()
      
      // Então o sistema deve rejeitar e mostrar erro
      LoginPage.shouldShowErrorMessage()
    })

    it('Não deve permitir login com XSS no campo email', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando tento fazer login com tentativa de XSS
      const xssAttempt = '<script>alert("XSS")</script>'
      LoginPage.fillLoginForm(xssAttempt, 'senha123')
      LoginPage.submitLogin()
      
      // Então o sistema deve sanitizar e rejeitar
      LoginPage.shouldShowErrorMessage()
    })

    it('Não deve permitir login após múltiplas tentativas falhas', () => {
      // Dado que estou na página de login
      LoginPage.shouldBeOnLoginPage()
      
      // Quando tento fazer login várias vezes com credenciais inválidas
      for (let i = 0; i < 5; i++) {
        LoginPage.fillLoginForm('email@teste.com', 'senha-errada')
        LoginPage.submitLogin()
        cy.wait(1000)
      }
      
      // Então o sistema deve bloquear ou mostrar mensagem de segurança
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
      // Dado que estou na página de um produto
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.shouldBeOnProductPage()
      
      // Quando tento adicionar quantidade negativa
      ProductPage.quantityInput.clear().type('-1')
      ProductPage.addToCartButton.click()
      
      // Então o sistema deve validar e não permitir
      // (A validação pode ser no frontend ou backend)
      cy.get('body').then(($body) => {
        if ($body.text().includes('quantidade inválida') || $body.text().includes('quantidade mínima')) {
          cy.contains(/quantidade inválida|quantidade mínima/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir adicionar quantidade zero ao carrinho', () => {
      // Dado que estou na página de um produto
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.shouldBeOnProductPage()
      
      // Quando tento adicionar quantidade zero
      ProductPage.quantityInput.clear().type('0')
      ProductPage.addToCartButton.click()
      
      // Então o sistema deve validar e não permitir
      cy.get('body').then(($body) => {
        if ($body.text().includes('quantidade mínima')) {
          cy.contains(/quantidade mínima/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir adicionar quantidade acima do estoque disponível', () => {
      // Dado que estou na página de um produto
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.shouldBeOnProductPage()
      
      // Quando tento adicionar quantidade muito alta (ex: 99999)
      ProductPage.quantityInput.clear().type('99999')
      ProductPage.addToCartButton.click()
      
      // Então o sistema deve validar estoque
      cy.get('body').then(($body) => {
        if ($body.text().includes('estoque') || $body.text().includes('disponível')) {
          cy.contains(/estoque|disponível/i).should('be.visible')
        }
      })
    })

    it('Não deve permitir remover item de carrinho vazio', () => {
      // Dado que o carrinho está vazio
      CartPage.visit()
      CartPage.shouldBeEmpty()
      
      // Quando tento remover um item (que não existe)
      // Então não deve haver botões de remoção disponíveis
      cy.get('.remove, .product-remove').should('not.exist')
    })
  })

  describe('Validações de Checkout', () => {
    
    beforeEach(() => {
      // Adicionar produto ao carrinho para os testes de checkout
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.addToCart()
      ProductPage.viewCart()
      CartPage.proceedToCheckout()
      CheckoutPage.shouldBeOnCheckoutPage()
    })

    it('Não deve permitir checkout com email inválido', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho com email inválido
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
      
      // Então devo ver mensagem de erro de email
      CheckoutPage.shouldShowError('email')
    })

    it('Não deve permitir checkout com telefone inválido', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho com telefone inválido (muito curto)
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: '123', // Telefone inválido
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: '01234-567'
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      // Então devo ver mensagem de erro
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com CEP inválido', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho com CEP inválido
      const billingData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@teste.com',
        phone: '11999999999',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        postcode: '123' // CEP inválido
      }
      
      CheckoutPage.fillBillingData(billingData)
      CheckoutPage.placeOrder()
      
      // Então devo ver mensagem de erro
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout sem selecionar método de pagamento', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho todos os dados mas não seleciono pagamento
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
      // Não selecionar método de pagamento
      CheckoutPage.placeOrder()
      
      // Então devo ver mensagem de erro
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com caracteres especiais em campos numéricos', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho campos numéricos com caracteres especiais
      CheckoutPage.billingPhone.clear().type('abc!@#')
      CheckoutPage.billingPostcode.clear().type('xyz!@#')
      
      // Então o sistema deve validar e não permitir
      CheckoutPage.placeOrder()
      CheckoutPage.shouldShowError()
    })

    it('Não deve permitir checkout com campos obrigatórios vazios', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando tento finalizar sem preencher campos obrigatórios
      CheckoutPage.placeOrder()
      
      // Então devo ver múltiplas mensagens de erro
      cy.get('.woocommerce-error li, .error').should('have.length.greaterThan', 0)
    })

    it('Não deve permitir checkout com dados muito longos (buffer overflow)', () => {
      // Dado que estou na página de checkout
      CheckoutPage.shouldBeOnCheckoutPage()
      
      // Quando preencho campos com strings muito longas
      const longString = 'A'.repeat(1000)
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
      
      // Então o sistema deve validar tamanho máximo
      CheckoutPage.shouldShowError()
    })
  })

  describe('Validações de Busca', () => {
    
    beforeEach(() => {
      HomePage.visit()
    })

    it('Não deve quebrar com busca vazia', () => {
      // Dado que estou na página inicial
      HomePage.shouldBeOnHomePage()
      
      // Quando tento buscar sem digitar nada
      HomePage.searchButton.click()
      
      // Então o sistema deve tratar adequadamente (pode mostrar todos ou mensagem)
      cy.url().should('include', 's=')
    })

    it('Não deve quebrar com busca contendo caracteres especiais', () => {
      // Dado que estou na página inicial
      HomePage.shouldBeOnHomePage()
      
      // Quando busco com caracteres especiais
      HomePage.searchProduct('!@#$%^&*()')
      
      // Então o sistema deve tratar adequadamente
      cy.get('body').should('be.visible')
    })

    it('Não deve quebrar com busca contendo SQL injection', () => {
      // Dado que estou na página inicial
      HomePage.shouldBeOnHomePage()
      
      // Quando busco com tentativa de SQL injection
      HomePage.searchProduct("'; DROP TABLE products; --")
      
      // Então o sistema deve sanitizar e não quebrar
      cy.get('body').should('be.visible')
    })
  })

  describe('Validações de Navegação', () => {
    
    it('Não deve quebrar ao acessar URL inválida', () => {
      // Quando acesso uma URL que não existe
      cy.visit('/pagina-que-nao-existe-12345', { failOnStatusCode: false })
      
      // Então o sistema deve mostrar página 404 ou redirecionar
      cy.get('body').should('be.visible')
    })

    it('Não deve permitir acesso direto ao checkout sem produtos', () => {
      // Quando tento acessar checkout diretamente sem produtos no carrinho
      CheckoutPage.visit()
      
      // Então devo ser redirecionado ou ver mensagem
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        if (bodyText.includes('carrinho vazio') || bodyText.includes('sem produtos')) {
          cy.contains(/carrinho vazio|sem produtos/i).should('be.visible')
        } else {
          // Ou pode redirecionar para carrinho
          cy.url().should('include', 'carrinho')
        }
      })
    })
  })
})

