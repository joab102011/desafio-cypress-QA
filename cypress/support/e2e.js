import './commands'
import './commands-performance'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

Cypress.on('log:added', (options) => {
  if (options.instrument === 'command' && options.consoleProps) {
  }
})

Cypress.on('fail', (error) => {
  throw error
})

