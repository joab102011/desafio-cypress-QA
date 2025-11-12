const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  execTimeout: 60000,
  requestTimeout: 10000,
  pageLoadTimeout: 30000,
  retries: {
    // Retry padrão para reduzir flaky tests em testes de frontend
    // runMode: 2 retries em CI/CD (headless) - ajuda a lidar com instabilidades de rede/performance
    // openMode: 1 retry no modo interativo - menos retries para não atrasar desenvolvimento
    runMode: 2,
    openMode: 1
  },
  video: true,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  videoCompression: 32,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  env: {},
  e2e: {
    baseUrl: 'http://lojaebac.ebaconline.art.br',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      on('before:run', () => {})
      return config
    },
    experimentalRunAllSpecs: false,
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  numTestsKeptInMemory: 0,
})
