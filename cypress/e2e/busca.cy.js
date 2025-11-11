/**
 * Testes de Busca de Produtos
 * 
 * Cenário Crítico: Funcionalidade de busca
 * 
 * Justificativa: A busca é essencial para que os clientes encontrem produtos
 * rapidamente. É crítico garantir que:
 * 1. A busca retorne resultados relevantes
 * 2. Buscas sem resultados sejam tratadas adequadamente
 * 3. A busca seja performática
 * 4. Filtros funcionem corretamente (se aplicável)
 * 
 * Problemas na busca podem resultar em abandono de carrinho e perda de vendas.
 */

import HomePage from '../support/page-objects/HomePage'
import ProductPage from '../support/page-objects/ProductPage'

describe('Testes de Busca de Produtos', () => {
  
  // Hook executado antes de cada teste
  beforeEach(() => {
    HomePage.visit()
  })

  it('Deve retornar resultados para busca válida', () => {
    // Dado que estou na página inicial
    HomePage.shouldBeOnHomePage()
    
    // Quando busco por um termo válido
    HomePage.searchProduct('produto')
    
    // Então devo ver resultados da busca
    cy.url().should('include', 's=produto')
    cy.get('.products, .woocommerce-loop-product').should('have.length.greaterThan', 0)
  })

  it('Deve exibir mensagem quando não há resultados', () => {
    // Dado que estou na página inicial
    HomePage.shouldBeOnHomePage()
    
    // Quando busco por um termo que não existe
    HomePage.searchProduct('xyzabc123456789')
    
    // Então devo ver uma mensagem informando que não há resultados
    cy.contains('Nenhum produto encontrado').should('be.visible')
  })

  it('Deve permitir buscar por nome parcial do produto', () => {
    // Dado que estou na página inicial
    HomePage.shouldBeOnHomePage()
    
    // Quando busco por parte do nome de um produto
    HomePage.searchProduct('cam')
    
    // Então devo ver produtos relacionados
    cy.get('.products, .woocommerce-loop-product').should('exist')
  })

  it('Deve navegar para produto a partir dos resultados da busca', () => {
    // Dado que realizei uma busca
    HomePage.searchProduct('produto')
    
    // Quando clico em um produto nos resultados
    cy.get('.product, .woocommerce-loop-product__link').first().click()
    
    // Então devo ser redirecionado para a página do produto
    ProductPage.shouldBeOnProductPage()
  })
})

