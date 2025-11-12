# Guia de Contribuição

Este documento fornece diretrizes para contribuir com o projeto, seguindo as melhores práticas e recomendações do entrevistador.

## 🎯 Princípios do Projeto

Seguindo as orientações recebidas, este projeto prioriza:

1. **Código não básico** - Use Commands customizados extensivamente
2. **Sem herança desnecessária** - Evite herança complexa, prefira composição
3. **Comentários detalhados** - Documente tudo que fizer
4. **Fácil manutenção** - Estrutura clara e organizada
5. **Teste e reteste** - Valide que tudo funciona antes de commitar

## 📝 Padrões de Código

### Commands Customizados

Sempre que possível, crie commands customizados em `cypress/support/commands.js`:

```javascript
/**
 * Descrição clara do que o command faz
 * @param {type} param - Descrição do parâmetro
 * 
 * Exemplo de uso:
 * cy.meuCommand('valor')
 */
Cypress.Commands.add('meuCommand', (param) => {
  // Implementação com comentários explicativos
})
```

### Page Objects

Crie Page Objects em `cypress/support/page-objects/`:

```javascript
/**
 * Page Object para [Nome da Página]
 * 
 * Este arquivo contém os seletores e métodos relacionados à página.
 */
class MinhaPage {
  get elemento() {
    return cy.get('.seletor')
  }

  /**
   * Descrição do método
   */
  meuMetodo() {
    // Implementação
  }
}

export default new MinhaPage()
```

### Testes

Siga o padrão BDD (Given/When/Then):

```javascript
it('Deve fazer algo', () => {
  // Dado que...
  // Quando...
  // Então...
})
```

## ✅ Checklist antes de Commitar

- [ ] Código foi testado localmente
- [ ] Comentários adicionados onde necessário
- [ ] Lint executado sem erros (`npm run lint`)
- [ ] Formatação verificada (`npm run format:check`)
- [ ] Commits descritivos e claros
- [ ] Não há código básico desnecessário
- [ ] Commands customizados foram utilizados quando apropriado

## 🚀 Processo de Contribuição

1. **Fork o repositório** (se aplicável)
2. **Crie uma branch** para sua feature/fix
3. **Desenvolva** seguindo os padrões
4. **Teste** localmente
5. **Execute lint e formatação**
6. **Faça commit** com mensagem descritiva
7. **Abra Pull Request** com descrição clara

## 📋 Mensagens de Commit

Use o padrão Conventional Commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de manutenção

Exemplo:
```
feat: adiciona command customizado para busca de produtos
```

## 🧪 Executar Testes

Antes de fazer push, sempre execute:

```bash
# Testes locais
npm run cy:run

# Lint
npm run lint

# Formatação
npm run format:check
```

## 💡 Dicas

- **Comente tudo**: O entrevistador valoriza código bem documentado
- **Use Commands**: Evite código básico, crie commands reutilizáveis
- **Teste várias vezes**: Como recomendado, teste e reteste
- **Mantenha simples**: Evite complexidade desnecessária
- **Pense em manutenção**: Código que você escreve hoje será mantido amanhã

## ❓ Dúvidas?

Se tiver dúvidas sobre padrões ou boas práticas, consulte:
- Documentação do Cypress: https://docs.cypress.io
- README.md do projeto
- Código existente como referência

