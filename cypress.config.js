const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  execTimeout: 60000,
  requestTimeout: 10000,
  pageLoadTimeout: 30000,
  retries: {
    runMode: 0,
    openMode: 0
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
