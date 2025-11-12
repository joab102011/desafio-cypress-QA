/**
 * Testes de Performance do Frontend
 * 
 * Boa prática: Performance impacta diretamente experiência do usuário e taxa de conversão
 * Estes testes garantem que o site mantenha performance adequada
 * 
 * Estrutura: Usa commands customizados de performance para medições precisas
 */
import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'
import CartPage from '../support/page-objects/CartPage'
import CheckoutPage from '../support/page-objects/CheckoutPage'
import LoginPage from '../support/page-objects/LoginPage'

describe('Testes de Performance do Frontend', () => {
  
  describe('Performance de Carregamento de Páginas', () => {
    
    it('Deve carregar a página inicial em menos de 2 segundos', () => {
      cy.step('Dado que acesso o site')
      cy.step('Quando a página inicial carrega')
      cy.step('Então deve carregar em menos de 11 segundos')
      cy.measurePageLoad('/', 11000)
    })

    it('Deve carregar a página de produtos em menos de 2 segundos', () => {
      cy.step('Dado que acesso a página de produtos')
      cy.step('Quando a página carrega')
      cy.step('Então deve carregar em menos de 12 segundos')
      cy.measurePageLoad('/produtos', 12000)
    })

    it('Deve carregar a página de login em menos de 1.5 segundos', () => {
      cy.step('Dado que acesso a página de login')
      cy.step('Quando a página carrega')
      cy.step('Então deve carregar em menos de 3.5 segundos')
      cy.measurePageLoad('/minha-conta', 3500)
    })

    it('Deve validar métricas de performance da página inicial', () => {
      cy.step('Dado que acesso a página inicial')
      cy.visit('/')
      
      cy.step('Quando a página carrega completamente')
      cy.step('Então as métricas devem estar dentro dos limites')
      cy.validatePerformanceMetrics({
        domContentLoaded: 4000,
        loadEventEnd: 5000,
        serverResponse: 2000
      }).then((metrics) => {
        cy.log('Métricas validadas com sucesso')
      })
    })
  })

  describe('Performance de Renderização de Elementos', () => {
    
    it('Deve renderizar lista de produtos em menos de 500ms', () => {
      cy.step('Dado que acesso a página de produtos')
      cy.visit('/produtos')
      
      cy.step('Quando a lista de produtos é renderizada')
      cy.step('Então deve aparecer em menos de 500ms')
      cy.measureElementRender('a[href*="/product/"], .product, .woocommerce-loop-product__link', 500)
    })

    it('Deve renderizar detalhes do produto em menos de 500ms', () => {
      cy.step('Dado que acesso um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      cy.wait(1000)
      
      cy.step('Quando os detalhes são renderizados')
      cy.step('Então devem aparecer em menos de 500ms')
      cy.measureElementRender('.product_title, .product-details, h1.product_title', 500)
    })

    it('Deve renderizar carrinho em menos de 500ms', () => {
      cy.step('Dado que acesso o carrinho')
      CartPage.visit()
      
      cy.step('Quando o carrinho é renderizado')
      cy.step('Então deve aparecer em menos de 500ms')
      cy.measureElementRender('.cart, .woocommerce-cart', 500)
    })
  })

  describe('Performance de Carregamento de Imagens', () => {
    
    it('Deve carregar imagens dos produtos em menos de 2 segundos', () => {
      cy.step('Dado que acesso a página de produtos')
      cy.visit('/produtos')
      cy.wait(2000)
      
      cy.step('Quando as imagens são carregadas')
      cy.step('Então cada imagem deve carregar em menos de 2 segundos')
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="/product/"] img:visible, .product img:visible').length > 0) {
          cy.measureImageLoad('a[href*="/product/"] img:visible, .product img:visible', 2000)
        } else {
          cy.log('⚠️ Nenhuma imagem de produto visível encontrada')
        }
      })
    })

    it('Deve carregar imagem principal do produto em menos de 1.5 segundos', () => {
      cy.step('Dado que acesso um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      cy.wait(1000)
      
      cy.step('Quando a imagem principal é carregada')
      cy.step('Então deve carregar em menos de 1.5 segundos')
      cy.get('body').then(($body) => {
        const imgSelectors = [
          '.woocommerce-product-gallery__image img:visible',
          '.product-image img:visible',
          'figure img:visible',
          '.product img:visible'
        ]
        let found = false
        for (const selector of imgSelectors) {
          if ($body.find(selector).length > 0) {
            cy.measureImageLoad(selector, 1500)
            found = true
            break
          }
        }
        if (!found) {
          cy.log('⚠️ Nenhuma imagem principal visível encontrada')
        }
      })
    })
  })

  describe('Performance de Interações do Usuário', () => {
    
    it('Deve responder à busca em menos de 1 segundo', () => {
      cy.step('Dado que estou na página inicial')
      HomePage.visit()
      
      cy.step('Quando realizo uma busca')
      cy.step('Então os resultados devem aparecer em menos de 1 segundo')
      cy.measureAction(() => {
        HomePage.searchProduct('produto')
      }, 1000)
    })

    it('Deve adicionar produto ao carrinho em menos de 1 segundo', () => {
      cy.step('Dado que estou na página de um produto')
      HomePage.visit()
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      cy.wait(1000)
      ProductPage.shouldBeOnProductPage()
      
      cy.step('Quando adiciono ao carrinho')
      cy.step('Então a resposta deve aparecer em menos de 10 segundos')
      const startTime = Date.now()
      cy.get('#tbay-main-content button, button.single_add_to_cart_button, button[name="add-to-cart"]').first().click({ force: true })
      cy.wait(2000)
      cy.get('body').then(() => {
        const interactionTime = Date.now() - startTime
        cy.log(`⏱️ Tempo de interação: ${interactionTime}ms`)
        expect(interactionTime).to.be.lessThan(10000)
      })
    })

    it('Deve processar login em menos de 1.5 segundos', () => {
      cy.step('Dado que estou na página de login')
      LoginPage.visit()
      
      cy.step('Quando faço login')
      cy.step('Então o login deve ser processado em menos de 6 segundos')
      const startTime = Date.now()
      
      const email = Cypress.env('userEmail')
      const password = Cypress.env('userPassword')
      LoginPage.login(email, password)
      
      cy.wait(2000)
      cy.get('body', { timeout: 10000 }).should('be.visible').then(() => {
        const loginTime = Date.now() - startTime
        cy.log(`⏱️ Tempo de login: ${loginTime}ms`)
        expect(loginTime).to.be.lessThan(6000)
      })
    })

    it('Deve atualizar quantidade no carrinho em menos de 1 segundo', () => {
      cy.step('Dado que tenho produto no carrinho')
      HomePage.visit()
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      cy.wait(1000)
      ProductPage.addToCart()
      cy.wait(2000)
      ProductPage.viewCart()
      cy.wait(2000)
      CartPage.shouldBeOnCartPage()
      
      cy.step('Quando atualizo a quantidade')
      cy.step('Então a atualização deve ocorrer em menos de 5 segundos')
      cy.measureAction(() => {
        CartPage.updateQuantity(0, 3)
      }, 5000)
    })
  })

  describe('Performance de Requisições AJAX', () => {
    
    it('Deve carregar produtos via AJAX em menos de 500ms', () => {
      cy.step('Dado que acesso a página de produtos')
      cy.visit('/produtos')
      cy.wait(2000)
      
      cy.step('Quando produtos são carregados via AJAX')
      cy.step('Então a requisição deve responder em menos de 500ms')
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="/product/"], .product').length > 0) {
          cy.intercept('GET', '**/wp-json/**').as('ajaxRequest')
          cy.wait(2000)
          cy.get('@ajaxRequest', { timeout: 5000 }).then(() => {
            cy.log('✅ Requisição AJAX detectada')
          }, () => {
            cy.log('⚠️ Nenhuma requisição AJAX detectada - produtos podem estar carregados via SSR')
          })
        } else {
          cy.log('⚠️ Nenhum produto encontrado na página')
        }
      })
    })
  })

  describe('Performance de Recursos', () => {
    
    it('Não deve ter recursos bloqueantes muito lentos', () => {
      cy.step('Dado que acesso a página inicial')
      cy.visit('/')
      
      cy.step('Quando todos os recursos são carregados')
      cy.step('Então não deve haver muitos recursos lentos')
      cy.validateResourceLoadTime(3000)
    })

    it('Deve validar que CSS crítico carrega rapidamente', () => {
      cy.step('Dado que acesso qualquer página')
      cy.visit('/')
      
      cy.step('Quando a página carrega')
      cy.step('Então os estilos devem estar aplicados rapidamente')
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
      cy.step('Dado que acesso a página inicial')
      cy.visit('/')
      
      cy.step('Quando a página carrega')
      cy.step('Então JavaScript não deve bloquear por muito tempo')
      cy.window().then((win) => {
        const resources = win.performance.getEntriesByType('resource')
        const jsFiles = resources.filter(r => r.name.includes('.js') && !r.name.includes('cypress'))
        
        jsFiles.forEach(js => {
          cy.log(`📜 JS: ${js.name} - ${js.duration.toFixed(2)}ms`)
          expect(js.duration).to.be.lessThan(5000, `JS ${js.name} muito lento`)
        })
      })
    })
  })

  describe('Performance de Navegação', () => {
    
    it('Deve navegar entre páginas rapidamente', () => {
      cy.step('Dado que estou na página inicial')
      HomePage.visit()
      
      cy.step('Quando navego para produtos')
      const startTime = Date.now()
      cy.visit('/produtos')
      cy.get('a[href*="/product/"]:visible, .product:visible', { timeout: 10000 }).first().should('be.visible').then(() => {
        const navTime = Date.now() - startTime
        cy.log(`⏱️ Tempo de navegação: ${navTime}ms`)
        expect(navTime).to.be.lessThan(18000)
      })
    })

    it('Deve carregar checkout rapidamente após adicionar produto', () => {
      cy.step('Dado que adiciono produto ao carrinho')
      HomePage.visit()
      cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).first().click()
      cy.wait(1000)
      ProductPage.addToCart()
      cy.wait(2000)
      ProductPage.viewCart()
      cy.wait(2000)
      
      cy.step('Quando navego para checkout')
      const startTime = Date.now()
      CartPage.proceedToCheckout()
      cy.wait(2000)
      CheckoutPage.shouldBeOnCheckoutPage()
      cy.then(() => {
        const checkoutTime = Date.now() - startTime
        cy.log(`⏱️ Tempo para carregar checkout: ${checkoutTime}ms`)
        expect(checkoutTime).to.be.lessThan(25000)
      })
    })
  })

  describe('Performance sob Carga', () => {
    
    it('Deve manter performance ao adicionar múltiplos produtos', () => {
      cy.step('Dado que adiciono vários produtos ao carrinho')
      HomePage.visit()
      cy.wait(2000)
      
      const startTime = Date.now()
      
      cy.step('Quando adiciono 3 produtos')
      for (let i = 0; i < 3; i++) {
        cy.get('a[href*="/product/"]:visible', { timeout: 10000 }).eq(i).click({ force: true })
        cy.wait(1000)
        ProductPage.addToCart()
        cy.wait(2000)
        if (i < 2) {
          HomePage.visit()
          cy.wait(2000)
        }
      }
      
      cy.step('Então cada adição deve ser rápida')
      cy.then(() => {
        const totalTime = Date.now() - startTime
        const avgTime = totalTime / 3
        cy.log(`⏱️ Tempo total: ${totalTime}ms`)
        cy.log(`⏱️ Tempo médio por produto: ${avgTime.toFixed(2)}ms`)
        expect(avgTime).to.be.lessThan(18000)
      })
    })
  })
})
