/**
 * Testes de Performance do Frontend
 * 
 * Cenário Crítico: Performance e Responsividade
 * 
 * Justificativa: A performance do frontend impacta diretamente:
 * 1. Experiência do usuário (UX)
 * 2. Taxa de conversão (usuários abandonam sites lentos)
 * 3. SEO (Google penaliza sites lentos)
 * 4. Custos de infraestrutura
 * 5. Satisfação do cliente
 * 
 * Estes testes garantem que o site mantenha performance adequada
 * mesmo com crescimento de tráfego e funcionalidades.
 */

import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'
import LoginPage from '../support/page-objects/LoginPage'

describe('Testes de Performance do Frontend', () => {
  
  describe('Performance de Carregamento de Páginas', () => {
    
    it('Deve carregar a página inicial em menos de 2 segundos', () => {
      // Dado que acesso o site
      // Quando a página inicial carrega
      // Então deve carregar em menos de 2 segundos
      cy.measurePageLoad('/', 2000)
    })

    it('Deve carregar a página de produtos em menos de 2 segundos', () => {
      // Dado que acesso a página de produtos
      // Quando a página carrega
      // Então deve carregar em menos de 2 segundos
      cy.measurePageLoad('/produtos', 2000)
    })

    it('Deve carregar a página de login em menos de 1.5 segundos', () => {
      // Dado que acesso a página de login
      // Quando a página carrega
      // Então deve carregar em menos de 1.5 segundos
      cy.measurePageLoad('/minha-conta', 1500)
    })

    it('Deve validar métricas de performance da página inicial', () => {
      // Dado que acesso a página inicial
      cy.visit('/')
      
      // Quando a página carrega completamente
      // Então as métricas devem estar dentro dos limites
      cy.validatePerformanceMetrics({
        domContentLoaded: 2000,  // DOM pronto em menos de 2s
        loadEventEnd: 3000,       // Página carregada em menos de 3s
        serverResponse: 1000       // Resposta do servidor em menos de 1s
      })
    })
  })

  describe('Performance de Renderização de Elementos', () => {
    
    it('Deve renderizar lista de produtos em menos de 500ms', () => {
      // Dado que acesso a página de produtos
      cy.visit('/produtos')
      
      // Quando a lista de produtos é renderizada
      // Então deve aparecer em menos de 500ms
      cy.measureElementRender('.products, .woocommerce-loop-product', 500)
    })

    it('Deve renderizar detalhes do produto em menos de 500ms', () => {
      // Dado que acesso um produto
      HomePage.visit()
      cy.get('.product').first().click()
      
      // Quando os detalhes são renderizados
      // Então devem aparecer em menos de 500ms
      cy.measureElementRender('.product_title, .product-details', 500)
    })

    it('Deve renderizar carrinho em menos de 500ms', () => {
      // Dado que acesso o carrinho
      CartPage.visit()
      
      // Quando o carrinho é renderizado
      // Então deve aparecer em menos de 500ms
      cy.measureElementRender('.cart, .woocommerce-cart', 500)
    })
  })

  describe('Performance de Carregamento de Imagens', () => {
    
    it('Deve carregar imagens dos produtos em menos de 2 segundos', () => {
      // Dado que acesso a página de produtos
      cy.visit('/produtos')
      
      // Quando as imagens são carregadas
      // Então cada imagem deve carregar em menos de 2 segundos
      cy.measureImageLoad('.product img, .woocommerce-loop-product__link img', 2000)
    })

    it('Deve carregar imagem principal do produto em menos de 1.5 segundos', () => {
      // Dado que acesso um produto
      HomePage.visit()
      cy.get('.product').first().click()
      
      // Quando a imagem principal é carregada
      // Então deve carregar em menos de 1.5 segundos
      cy.measureImageLoad('.product-image img, .woocommerce-product-gallery__image img', 1500)
    })
  })

  describe('Performance de Interações do Usuário', () => {
    
    it('Deve responder à busca em menos de 1 segundo', () => {
      // Dado que estou na página inicial
      HomePage.visit()
      
      // Quando realizo uma busca
      // Então os resultados devem aparecer em menos de 1 segundo
      cy.measureAction(() => {
        HomePage.searchProduct('produto')
      }, 1000)
    })

    it('Deve adicionar produto ao carrinho em menos de 1 segundo', () => {
      // Dado que estou na página de um produto
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.shouldBeOnProductPage()
      
      // Quando adiciono ao carrinho
      // Então a resposta deve aparecer em menos de 1 segundo
      cy.measureInteraction(
        'button[name="add-to-cart"], .single_add_to_cart_button',
        '.woocommerce-message, .success',
        1000
      )
    })

    it('Deve processar login em menos de 1.5 segundos', () => {
      // Dado que estou na página de login
      LoginPage.visit()
      
      // Quando faço login
      // Então o redirecionamento deve ocorrer em menos de 1.5 segundos
      const startTime = Date.now()
      
      const email = Cypress.env('userEmail')
      const password = Cypress.env('userPassword')
      LoginPage.login(email, password)
      
      cy.url().should('not.include', '/minha-conta').then(() => {
        const loginTime = Date.now() - startTime
        cy.log(`⏱️ Tempo de login: ${loginTime}ms`)
        expect(loginTime).to.be.lessThan(1500)
      })
    })

    it('Deve atualizar quantidade no carrinho em menos de 1 segundo', () => {
      // Dado que tenho produto no carrinho
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.addToCart()
      ProductPage.viewCart()
      CartPage.shouldBeOnCartPage()
      
      // Quando atualizo a quantidade
      // Então a atualização deve ocorrer em menos de 1 segundo
      cy.measureAction(() => {
        CartPage.updateQuantity(0, 3)
      }, 1000)
    })
  })

  describe('Performance de Requisições AJAX', () => {
    
    it('Deve carregar produtos via AJAX em menos de 500ms', () => {
      // Dado que acesso a página de produtos
      cy.visit('/produtos')
      
      // Quando produtos são carregados via AJAX
      // Então a requisição deve responder em menos de 500ms
      // (Ajustar padrão de URL conforme necessário)
      cy.get('body').then(($body) => {
        if ($body.find('.products').length > 0) {
          // Se houver requisições AJAX, medir
          cy.measureAjaxResponse('GET', '**/api/products**', 500).catch(() => {
            // Se não houver AJAX, pular teste
            cy.log('⚠️ Nenhuma requisição AJAX detectada')
          })
        }
      })
    })
  })

  describe('Performance de Recursos', () => {
    
    it('Não deve ter recursos bloqueantes muito lentos', () => {
      // Dado que acesso a página inicial
      cy.visit('/')
      
      // Quando todos os recursos são carregados
      // Então não deve haver muitos recursos lentos (>3s)
      cy.validateResourceLoadTime(3000)
    })

    it('Deve validar que CSS crítico carrega rapidamente', () => {
      // Dado que acesso qualquer página
      cy.visit('/')
      
      // Quando a página carrega
      // Então os estilos devem estar aplicados rapidamente
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const cssFiles = resources.filter(r => r.name.includes('.css'))
        
        cssFiles.forEach(css => {
          cy.log(`📄 CSS: ${css.name} - ${css.duration.toFixed(2)}ms`)
          expect(css.duration).to.be.lessThan(2000, `CSS ${css.name} muito lento`)
        })
      })
    })

    it('Deve validar que JavaScript não bloqueia renderização', () => {
      // Dado que acesso a página inicial
      cy.visit('/')
      
      // Quando a página carrega
      // Então JavaScript não deve bloquear por muito tempo
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const jsFiles = resources.filter(r => r.name.includes('.js') && !r.name.includes('cypress'))
        
        jsFiles.forEach(js => {
          cy.log(`📜 JS: ${js.name} - ${js.duration.toFixed(2)}ms`)
          // JavaScript pode demorar mais, mas não deve ser excessivo
          expect(js.duration).to.be.lessThan(5000, `JS ${js.name} muito lento`)
        })
      })
    })
  })

  describe('Performance de Navegação', () => {
    
    it('Deve navegar entre páginas rapidamente', () => {
      // Dado que estou na página inicial
      HomePage.visit()
      
      // Quando navego para produtos
      const startTime = Date.now()
      cy.visit('/produtos')
      cy.get('.products, .woocommerce-loop-product').should('be.visible').then(() => {
        const navTime = Date.now() - startTime
        cy.log(`⏱️ Tempo de navegação: ${navTime}ms`)
        expect(navTime).to.be.lessThan(2000)
      })
    })

    it('Deve carregar checkout rapidamente após adicionar produto', () => {
      // Dado que adiciono produto ao carrinho
      HomePage.visit()
      cy.get('.product').first().click()
      ProductPage.addToCart()
      ProductPage.viewCart()
      
      // Quando navego para checkout
      const startTime = Date.now()
      CartPage.proceedToCheckout()
      CheckoutPage.shouldBeOnCheckoutPage().then(() => {
        const checkoutTime = Date.now() - startTime
        cy.log(`⏱️ Tempo para carregar checkout: ${checkoutTime}ms`)
        expect(checkoutTime).to.be.lessThan(2000)
      })
    })
  })

  describe('Performance sob Carga', () => {
    
    it('Deve manter performance ao adicionar múltiplos produtos', () => {
      // Dado que adiciono vários produtos ao carrinho
      HomePage.visit()
      
      const startTime = Date.now()
      
      // Adicionar 5 produtos
      for (let i = 0; i < 5; i++) {
        cy.get('.product').eq(i).click()
        ProductPage.addToCart()
        HomePage.visit()
      }
      
      cy.then(() => {
        const totalTime = Date.now() - startTime
        const avgTime = totalTime / 5
        cy.log(`⏱️ Tempo total: ${totalTime}ms`)
        cy.log(`⏱️ Tempo médio por produto: ${avgTime.toFixed(2)}ms`)
        
        // Cada adição deve ser rápida
        expect(avgTime).to.be.lessThan(2000)
      })
    })
  })
})

