/**
 * Testes de Busca de Produtos
 * 
 * Boa prática: Busca é essencial para que clientes encontrem produtos rapidamente
 * Estes testes validam funcionalidade de busca com diferentes cenários
 * 
 * Estrutura BDD: Usa padrão Given/When/Then com cy.step() para clareza
 */
import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'

describe('Testes de Busca de Produtos', () => {
  // Antes de cada teste: navega para página inicial
  // Boa prática: Garante estado inicial consistente
  beforeEach(() => {
    HomePage.visit()
  })

  it('Deve retornar resultados para busca válida', () => {
    cy.step('Dado que estou na página inicial')
    HomePage.shouldBeOnHomePage()
    
    cy.step('Quando busco por um termo válido')
    HomePage.searchProduct('jacket')
    
    cy.step('Então devo ver resultados da busca')
    cy.url().should('include', 's=jacket')
    cy.get('a[href*="/product/"]', { timeout: 5000 }).should('have.length.greaterThan', 0)
  })

  it('Deve exibir mensagem quando não há resultados', () => {
    cy.step('Dado que estou na página inicial')
    HomePage.shouldBeOnHomePage()
    
    cy.step('Quando busco por um termo que não existe')
    HomePage.searchProduct('xyzabc123456789')
    
    cy.step('Então devo ver uma mensagem informando que não há resultados')
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('Nenhum produto encontrado') || bodyText.includes('No products found') || bodyText.includes('nenhum resultado')) {
        cy.contains(/Nenhum produto encontrado|No products found|nenhum resultado/i).should('be.visible')
      } else {
        cy.get('a[href*="/product/"]').should('have.length', 0)
      }
    })
  })

  it('Deve permitir buscar por nome parcial do produto', () => {
    cy.step('Dado que estou na página inicial')
    HomePage.shouldBeOnHomePage()
    
    cy.step('Quando busco por parte do nome de um produto')
    HomePage.searchProduct('ingrid')
    
    cy.step('Então devo ver produtos relacionados')
    cy.get('a[href*="/product/"]', { timeout: 5000 }).should('exist')
  })

  it('Deve navegar para produto a partir dos resultados da busca', () => {
    cy.step('Dado que realizei uma busca')
    HomePage.searchProduct('jacket')
    
    cy.step('Quando clico em um produto nos resultados')
    cy.get('a[href*="/product/"]', { timeout: 5000 }).first().click()
    
    cy.step('Então devo ser redirecionado para a página do produto')
    ProductPage.shouldBeOnProductPage()
  })
})
