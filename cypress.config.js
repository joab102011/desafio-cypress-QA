const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Configuração do viewport padrão
  viewportWidth: 1280,
  viewportHeight: 720,
  
  // Timeout padrão para comandos
  defaultCommandTimeout: 10000,
  
  // Timeout para execução de testes
  execTimeout: 60000,
  
  // Timeout para requisições
  requestTimeout: 10000,
  
  // Timeout para resposta de página
  pageLoadTimeout: 30000,
  
  // Configuração de retry para testes que falham (evita flaky tests)
  retries: {
    runMode: 2, // Retry 2 vezes em modo headless
    openMode: 0 // Não retry no modo interativo
  },
  
  // Configuração de vídeo e screenshots
  video: true,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  
  // Configuração do ambiente
  env: {
    // URL base será carregada do cypress.env.json
  },
  
  // Configuração de e2e
  e2e: {
    // Base URL do site a ser testado
    baseUrl: 'https://lojaebac.ebaconline.art.br',
    
    // Padrão de arquivos de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Arquivo de suporte (comandos customizados, configurações)
    supportFile: 'cypress/support/e2e.js',
    
    // Configuração de setup
    setupNodeEvents(on, config) {
      // Implementar plugins aqui se necessário
      return config
    },
  },
  
  // Configuração de componente (não utilizado neste projeto)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
})

