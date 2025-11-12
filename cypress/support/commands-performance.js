/**
 * Mede o tempo de carregamento de uma página
 * 
 * Boa prática: Usa Performance API do navegador para métricas precisas
 * Compara tempo de carregamento vs tempo total para identificar gargalos
 * 
 * @param {string} url - URL da página a ser medida
 * @param {number} [maxLoadTime=3000] - Tempo máximo aceitável em ms
 * @example
 * cy.measurePageLoad('/', 2000)
 */
Cypress.Commands.add('measurePageLoad', (url, maxLoadTime = 3000) => {
  const startTime = Date.now()
  
  // Usa Performance API para marcar início e fim do carregamento
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
    // Obtém métricas da Performance API
    const loadTime = win.performance.getEntriesByName('page-load')[0]?.duration || 0
    const totalTime = Date.now() - startTime
    
    cy.log(`⏱️ Tempo de carregamento: ${loadTime.toFixed(2)}ms`)
    cy.log(`⏱️ Tempo total: ${totalTime}ms`)
    // Valida que está dentro dos limites aceitáveis
    expect(loadTime).to.be.lessThan(maxLoadTime)
    expect(totalTime).to.be.lessThan(maxLoadTime + 2000)
  })
})

/**
 * Mede o tempo de resposta de uma ação do usuário
 * 
 * Boa prática: Útil para validar performance de interações (cliques, submits, etc)
 * Mede desde o início da ação até sua conclusão
 * 
 * @param {Function} action - Função que executa a ação a ser medida
 * @param {number} [maxResponseTime=1000] - Tempo máximo aceitável em ms
 * @example
 * cy.measureAction(() => cy.get('button').click(), 500)
 */
Cypress.Commands.add('measureAction', (action, maxResponseTime = 1000) => {
  const startTime = Date.now()
  
  // Executa a ação fornecida
  action()
  
  cy.then(() => {
    const responseTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de resposta da ação: ${responseTime}ms`)
    // Valida que a ação foi executada dentro do tempo esperado
    expect(responseTime).to.be.lessThan(maxResponseTime)
  })
})

/**
 * Mede o tempo de renderização de um elemento na página
 * 
 * Boa prática: Valida que elementos críticos aparecem rapidamente
 * Importante para garantir boa experiência do usuário
 * 
 * @param {string} selector - Seletor CSS do elemento
 * @param {number} [maxRenderTime=500] - Tempo máximo aceitável em ms
 * @example
 * cy.measureElementRender('.product-list', 300)
 */
Cypress.Commands.add('measureElementRender', (selector, maxRenderTime = 500) => {
  const startTime = Date.now()
  
  // Aguarda elemento aparecer e ficar visível
  cy.get(selector, { timeout: 10000 }).should('be.visible').then(() => {
    const renderTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de renderização do elemento: ${renderTime}ms`)
    // Valida que renderizou dentro do tempo esperado
    expect(renderTime).to.be.lessThan(maxRenderTime)
  })
})

/**
 * Valida métricas de performance da página usando Performance API
 * 
 * Boa prática: Valida múltiplas métricas de performance de uma vez
 * Usa Performance Timing API para obter dados precisos do navegador
 * 
 * @param {Object} thresholds - Objeto com limites aceitáveis para cada métrica
 * @param {number} [thresholds.domContentLoaded] - Limite para DOM Content Loaded
 * @param {number} [thresholds.loadEventEnd] - Limite para Load Event End
 * @param {number} [thresholds.serverResponse] - Limite para resposta do servidor
 * @returns {Promise<Object>} Objeto com todas as métricas coletadas
 * @example
 * cy.validatePerformanceMetrics({
 *   domContentLoaded: 2000,
 *   loadEventEnd: 3000
 * })
 */
Cypress.Commands.add('validatePerformanceMetrics', (thresholds) => {
  return cy.window().then((win) => {
    const perfData = win.performance.timing
    const navigation = win.performance.getEntriesByType('navigation')[0]
    
    // Calcula métricas importantes de performance
    const metrics = {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      loadEventEnd: perfData.loadEventEnd - perfData.navigationStart,
      firstPaint: navigation?.paintTimings?.firstPaint || null,
      firstContentfulPaint: navigation?.paintTimings?.firstContentfulPaint || null,
      serverResponse: perfData.responseEnd - perfData.requestStart,
      domParsing: perfData.domComplete - perfData.domInteractive
    }
    
    // Loga métricas para análise
    cy.log('📊 Métricas de Performance:')
    cy.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`)
    cy.log(`  - Load Event End: ${metrics.loadEventEnd}ms`)
    cy.log(`  - Server Response: ${metrics.serverResponse}ms`)
    cy.log(`  - DOM Parsing: ${metrics.domParsing}ms`)
    
    // Valida cada métrica se threshold foi fornecido
    if (thresholds.domContentLoaded) {
      expect(metrics.domContentLoaded).to.be.lessThan(thresholds.domContentLoaded)
    }
    
    if (thresholds.loadEventEnd) {
      expect(metrics.loadEventEnd).to.be.lessThan(thresholds.loadEventEnd)
    }
    
    if (thresholds.serverResponse) {
      expect(metrics.serverResponse).to.be.lessThan(thresholds.serverResponse)
    }
    
    return cy.wrap(metrics)
  })
})

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

Cypress.Commands.add('measureAjaxResponse', (method, urlPattern, maxResponseTime = 500) => {
  const startTime = Date.now()
  
  cy.intercept(method, urlPattern).as('ajaxRequest')
  
  cy.wait('@ajaxRequest').then((interception) => {
    const responseTime = interception.response.duration || (Date.now() - startTime)
    cy.log(`⏱️ Tempo de resposta AJAX: ${responseTime}ms`)
    expect(responseTime).to.be.lessThan(maxResponseTime)
  })
})

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
    
    expect(slowResources.length).to.be.lessThan(5, 'Muitos recursos lentos detectados')
  })
})

Cypress.Commands.add('measureInteraction', (clickSelector, responseSelector, maxInteractionTime = 1000) => {
  const startTime = Date.now()
  
  cy.get(clickSelector).click()
  cy.get(responseSelector).should('be.visible').then(() => {
    const interactionTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de interação: ${interactionTime}ms`)
    expect(interactionTime).to.be.lessThan(maxInteractionTime)
  })
})

