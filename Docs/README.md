# ConvertX pt-BR - kit de preparação do fork

Origem: https://github.com/C4illin/ConvertX

Este kit **não é um fork publicado nem uma tradução já integrada**. Contém um roteiro executável de criação do fork, catálogo inicial de traduções e especificação de implementação. O repositório original deve ser clonado no seu ambiente (acesso à rede GitHub necessário).

## 1. Criar fork

1. Acesse https://github.com/C4illin/ConvertX e clique em **Fork** na sua conta pessoal.
2. Clone seu fork: `git clone https://github.com/SEU_USUARIO/ConvertX.git`
3. `cd ConvertX`
4. `git remote add upstream https://github.com/C4illin/ConvertX.git`
5. `git switch -c feat/i18n-pt-br`
6. Copie `locales/` deste kit para `src/locales/` no repositório.
7. Implemente os passos de `IMPLEMENTACAO.md` com Cursor ou editor.
8. Rode `bun install`, `bun run check` (verifique scripts disponíveis em package.json), `bun test` e `docker compose build` conforme o repositório atual.
9. Commit, push e abra PR no seu fork.

## 2. Regras importantes

- Não confundir `LANGUAGE=pt-BR` (datas no upstream) com tradução da interface.
- A licença do projeto original é AGPL-3.0; mantenha atribuição e condições de redistribuição.
- O catálogo incluído é inicial. Cobertura completa exige extrair **todas** as mensagens reais do código-fonte atual, inclusive validação, erro, confirmação, autenticação, acessibilidade e conteúdo dinâmico.
- Evite habilitar `ALLOW_UNAUTHENTICATED` ou `ACCOUNT_REGISTRATION` em instâncias expostas à internet.

## 3. Critério de pronto

O fork estará pronto quando não houver textos de interface em inglês no fluxo pt-BR, exceto nomes técnicos e formatos; todos os testes passarem; e a imagem Docker for construída e validada no navegador.
