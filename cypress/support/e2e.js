// ***********************************************************
// Este arquivo é processado e carregado automaticamente antes dos seus arquivos de teste.
// Você pode ler mais sobre isso aqui: https://on.cypress.io/configuration
// ***********************************************************

// Importar comandos customizados
// Os comandos customizados são importados automaticamente quando este arquivo é carregado
import './commands'
import './commands-performance'

// Configurações globais de Cypress
// Desabilitar logs desnecessários no console
Cypress.on('uncaught:exception', (err) => {
  // Retornar false aqui previne que o Cypress falhe o teste
  // Útil para ignorar erros de JavaScript de terceiros que não afetam os testes
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  // Para outros erros, deixar o Cypress tratar normalmente
  return true
})

// Configuração de logs
Cypress.on('log:added', (options) => {
  // Personalizar logs se necessário
  if (options.instrument === 'command' && options.consoleProps) {
    // Adicionar informações extras aos logs se necessário
  }
})

// Hook para capturar screenshots em caso de falha
Cypress.on('fail', (error) => {
  // Adicionar lógica adicional se necessário antes de falhar
  throw error
})

