// ***********************************************************
// Commands Customizados para Testes de Performance
// 
// Este arquivo contém comandos específicos para medir e validar
// performance do frontend, seguindo boas práticas de performance testing.
// ***********************************************************

/**
 * Comando para medir o tempo de carregamento de uma página
 * @param {string} url - URL da página a ser medida
 * @param {number} maxLoadTime - Tempo máximo esperado em ms (padrão: 3000)
 * 
 * Exemplo de uso:
 * cy.measurePageLoad('/produtos', 2000)
 */
Cypress.Commands.add('measurePageLoad', (url, maxLoadTime = 3000) => {
  const startTime = Date.now()
  
  cy.visit(url, {
    onBeforeLoad: (win) => {
      win.performance.mark('page-start')
    },
    onLoad: (win) => {
      win.performance.mark('page-end')
      win.performance.measure('page-load', 'page-start', 'page-end')
    }
  })
  
  cy.window().then((win) => {
    const loadTime = win.performance.getEntriesByName('page-load')[0]?.duration || 0
    const totalTime = Date.now() - startTime
    
    cy.log(`⏱️ Tempo de carregamento: ${loadTime.toFixed(2)}ms`)
    cy.log(`⏱️ Tempo total: ${totalTime}ms`)
    
    // Validar se está dentro do tempo esperado
    expect(loadTime).to.be.lessThan(maxLoadTime)
    expect(totalTime).to.be.lessThan(maxLoadTime + 500) // Margem de erro
  })
})

/**
 * Comando para medir o tempo de resposta de uma ação
 * @param {Function} action - Função a ser executada e medida
 * @param {number} maxResponseTime - Tempo máximo esperado em ms
 * 
 * Exemplo de uso:
 * cy.measureAction(() => {
 *   cy.get('.product').click()
 * }, 1000)
 */
Cypress.Commands.add('measureAction', (action, maxResponseTime = 1000) => {
  const startTime = Date.now()
  
  action()
  
  cy.then(() => {
    const responseTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de resposta da ação: ${responseTime}ms`)
    expect(responseTime).to.be.lessThan(maxResponseTime)
  })
})

/**
 * Comando para medir o tempo de renderização de elementos
 * @param {string} selector - Seletor do elemento
 * @param {number} maxRenderTime - Tempo máximo esperado em ms
 * 
 * Exemplo de uso:
 * cy.measureElementRender('.product-list', 500)
 */
Cypress.Commands.add('measureElementRender', (selector, maxRenderTime = 500) => {
  const startTime = Date.now()
  
  cy.get(selector, { timeout: 10000 }).should('be.visible').then(() => {
    const renderTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de renderização do elemento: ${renderTime}ms`)
    expect(renderTime).to.be.lessThan(maxRenderTime)
  })
})

/**
 * Comando para validar métricas de performance do navegador
 * @param {object} thresholds - Limites de performance esperados
 * 
 * Exemplo de uso:
 * cy.validatePerformanceMetrics({
 *   loadEventEnd: 2000,
 *   domContentLoaded: 1500,
 *   firstPaint: 1000
 * })
 */
Cypress.Commands.add('validatePerformanceMetrics', (thresholds) => {
  cy.window().then((win) => {
    const perfData = win.performance.timing
    const navigation = win.performance.getEntriesByType('navigation')[0]
    
    // Calcular métricas
    const metrics = {
      // Tempo até DOM estar pronto
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      
      // Tempo até página estar completamente carregada
      loadEventEnd: perfData.loadEventEnd - perfData.navigationStart,
      
      // First Paint (se disponível)
      firstPaint: navigation?.paintTimings?.firstPaint || null,
      
      // First Contentful Paint (se disponível)
      firstContentfulPaint: navigation?.paintTimings?.firstContentfulPaint || null,
      
      // Tempo de resposta do servidor
      serverResponse: perfData.responseEnd - perfData.requestStart,
      
      // Tempo de parsing do DOM
      domParsing: perfData.domComplete - perfData.domInteractive
    }
    
    cy.log('📊 Métricas de Performance:')
    cy.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`)
    cy.log(`  - Load Event End: ${metrics.loadEventEnd}ms`)
    cy.log(`  - Server Response: ${metrics.serverResponse}ms`)
    cy.log(`  - DOM Parsing: ${metrics.domParsing}ms`)
    
    // Validar thresholds
    if (thresholds.domContentLoaded) {
      expect(metrics.domContentLoaded).to.be.lessThan(thresholds.domContentLoaded)
    }
    
    if (thresholds.loadEventEnd) {
      expect(metrics.loadEventEnd).to.be.lessThan(thresholds.loadEventEnd)
    }
    
    if (thresholds.serverResponse) {
      expect(metrics.serverResponse).to.be.lessThan(thresholds.serverResponse)
    }
    
    return metrics
  })
})

/**
 * Comando para medir o tempo de carregamento de imagens
 * @param {string} selector - Seletor das imagens
 * @param {number} maxImageLoadTime - Tempo máximo por imagem em ms
 * 
 * Exemplo de uso:
 * cy.measureImageLoad('.product-image img', 2000)
 */
Cypress.Commands.add('measureImageLoad', (selector, maxImageLoadTime = 2000) => {
  cy.get(selector).each(($img) => {
    const startTime = Date.now()
    
    cy.wrap($img).should('be.visible').and(($el) => {
      return new Promise((resolve) => {
        if ($el[0].complete) {
          resolve()
        } else {
          $el[0].addEventListener('load', resolve)
          $el[0].addEventListener('error', resolve)
        }
      })
    }).then(() => {
      const loadTime = Date.now() - startTime
      cy.log(`⏱️ Imagem carregada em: ${loadTime}ms`)
      expect(loadTime).to.be.lessThan(maxImageLoadTime)
    })
  })
})

/**
 * Comando para medir o tempo de resposta de uma requisição AJAX
 * @param {string} method - Método HTTP (GET, POST, etc)
 * @param {string} urlPattern - Padrão da URL a ser interceptada
 * @param {number} maxResponseTime - Tempo máximo esperado em ms
 * 
 * Exemplo de uso:
 * cy.measureAjaxResponse('GET', '**/api/products', 500)
 */
Cypress.Commands.add('measureAjaxResponse', (method, urlPattern, maxResponseTime = 500) => {
  const startTime = Date.now()
  
  cy.intercept(method, urlPattern).as('ajaxRequest')
  
  // Aguardar a requisição
  cy.wait('@ajaxRequest').then((interception) => {
    const responseTime = interception.response.duration || (Date.now() - startTime)
    cy.log(`⏱️ Tempo de resposta AJAX: ${responseTime}ms`)
    expect(responseTime).to.be.lessThan(maxResponseTime)
  })
})

/**
 * Comando para validar que não há recursos bloqueantes lentos
 * @param {number} maxResourceTime - Tempo máximo para carregar recursos em ms
 * 
 * Exemplo de uso:
 * cy.validateResourceLoadTime(3000)
 */
Cypress.Commands.add('validateResourceLoadTime', (maxResourceTime = 3000) => {
  cy.window().then((win) => {
    const resources = win.performance.getEntriesByType('resource')
    const slowResources = resources.filter(resource => resource.duration > maxResourceTime)
    
    if (slowResources.length > 0) {
      cy.log(`⚠️ Recursos lentos encontrados (${slowResources.length}):`)
      slowResources.forEach(resource => {
        cy.log(`  - ${resource.name}: ${resource.duration.toFixed(2)}ms`)
      })
    }
    
    // Avisar mas não falhar o teste (pode ser ajustado)
    expect(slowResources.length).to.be.lessThan(5, 'Muitos recursos lentos detectados')
  })
})

/**
 * Comando para medir o tempo de interação (clique até resposta)
 * @param {string} clickSelector - Seletor do elemento a ser clicado
 * @param {string} responseSelector - Seletor que indica a resposta
 * @param {number} maxInteractionTime - Tempo máximo esperado em ms
 * 
 * Exemplo de uso:
 * cy.measureInteraction('.add-to-cart', '.success-message', 1000)
 */
Cypress.Commands.add('measureInteraction', (clickSelector, responseSelector, maxInteractionTime = 1000) => {
  const startTime = Date.now()
  
  cy.get(clickSelector).click()
  cy.get(responseSelector).should('be.visible').then(() => {
    const interactionTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de interação: ${interactionTime}ms`)
    expect(interactionTime).to.be.lessThan(maxInteractionTime)
  })
})

