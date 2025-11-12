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
  // Seguindo recomendação do entrevistador de testar e retestar
  retries: {
    runMode: 2, // Retry 2 vezes em modo headless (CI/CD)
    openMode: 0 // Não retry no modo interativo
  },
  
  // Configuração de vídeo e screenshots
  video: true,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  
  // Configuração de vídeo (otimização para CI/CD)
  videoCompression: 32,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  
  // Configuração do ambiente
  env: {
    // URL base será carregada do cypress.env.json
    // Variáveis adicionais podem ser adicionadas aqui
  },
  
  // Configuração de e2e
  e2e: {
    // Base URL do site a ser testado (site externo)
    // Para sites externos, não precisamos verificar se o servidor está rodando
    baseUrl: 'http://lojaebac.ebaconline.art.br',
    
    // Padrão de arquivos de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Arquivo de suporte (comandos customizados, configurações)
    supportFile: 'cypress/support/e2e.js',
    
    // Configuração de setup
    setupNodeEvents(on, config) {
      // Implementar plugins aqui se necessário
      // Exemplo: relatórios, integrações, etc.
      
      // Listener para eventos de teste
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      
      // Desabilitar verificação de servidor para sites externos
      // Isso evita que o Cypress tente verificar se o servidor está rodando
      on('before:run', () => {
        // Não fazer nada - site externo não precisa de servidor local
      })
      
      return config
    },
    
    // Configuração de execução
    experimentalRunAllSpecs: false, // Desabilitado para melhor performance
  },
  
  // Configuração de componente (não utilizado neste projeto)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  
  // Configurações para CI/CD
  // Otimizações para execução em pipelines
  numTestsKeptInMemory: 0, // Reduz uso de memória em CI
})
