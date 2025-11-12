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
    expect(loadTime).to.be.lessThan(maxLoadTime)
    expect(totalTime).to.be.lessThan(maxLoadTime + 2000)
  })
})

Cypress.Commands.add('measureAction', (action, maxResponseTime = 1000) => {
  const startTime = Date.now()
  
  action()
  
  cy.then(() => {
    const responseTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de resposta da ação: ${responseTime}ms`)
    expect(responseTime).to.be.lessThan(maxResponseTime)
  })
})

Cypress.Commands.add('measureElementRender', (selector, maxRenderTime = 500) => {
  const startTime = Date.now()
  
  cy.get(selector, { timeout: 10000 }).should('be.visible').then(() => {
    const renderTime = Date.now() - startTime
    cy.log(`⏱️ Tempo de renderização do elemento: ${renderTime}ms`)
    expect(renderTime).to.be.lessThan(maxRenderTime)
  })
})

Cypress.Commands.add('validatePerformanceMetrics', (thresholds) => {
  return cy.window().then((win) => {
    const perfData = win.performance.timing
    const navigation = win.performance.getEntriesByType('navigation')[0]
    
    const metrics = {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      loadEventEnd: perfData.loadEventEnd - perfData.navigationStart,
      firstPaint: navigation?.paintTimings?.firstPaint || null,
      firstContentfulPaint: navigation?.paintTimings?.firstContentfulPaint || null,
      serverResponse: perfData.responseEnd - perfData.requestStart,
      domParsing: perfData.domComplete - perfData.domInteractive
    }
    
    cy.log('📊 Métricas de Performance:')
    cy.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`)
    cy.log(`  - Load Event End: ${metrics.loadEventEnd}ms`)
    cy.log(`  - Server Response: ${metrics.serverResponse}ms`)
    cy.log(`  - DOM Parsing: ${metrics.domParsing}ms`)
    
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

