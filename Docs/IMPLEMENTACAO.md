# Especificação para implementação no Cursor

## Objetivo
Implementar i18n completo na interface web do ConvertX, com inglês (`en`) como fallback e português do Brasil (`pt-BR`) como idioma padrão configurável. Não alterar comportamento dos conversores.

## Arquitetura
1. Inspecione `src/pages`, `src/components`, `src/services`, `src/index.tsx` e todos os arquivos de frontend para inventariar textos literais e mensagens de erro. Inspecione a geração de HTML server-side, JSX/TSX, scripts cliente e APIs.
2. Utilize um mecanismo simples, tipado e compatível com o padrão de renderização atual. Não introduza dependência pesada sem justificativa.
3. Crie catálogo `en.json` extraído dos textos **reais** do upstream e `pt-BR.json` com mesmas chaves. O `pt-BR.json` fornecido é um glossário inicial, não representa o inventário completo.
4. Função `t(key, params?, locale?)` com fallback `pt-BR -> en`, interpolação segura de parâmetros, tratamento de chave inexistente e testes.
5. Defina resolução de locale: preferência persistida do usuário (se houver) > cookie seguro ou configuração do navegador > variável `UI_LANGUAGE` > `en`. Se for desejado pt-BR como padrão da instância, configure `UI_LANGUAGE=pt-BR`. A variável `LANGUAGE` existente deve continuar formatando datas como documentado.
6. Adicione seletor de idioma acessível no cabeçalho, sem exigir login. Persistência por cookie SameSite=Lax ou localStorage, conforme a arquitetura efetiva. Não confundir preferência visual com autenticação.
7. Use `Intl.DateTimeFormat`, `Intl.NumberFormat` e `Intl.PluralRules` conforme o locale efetivo; defina `lang="pt-BR"` no documento em português.
8. Traduza upload, formatos, fila, andamento, histórico, login, registro, configurações, validações, mensagens de erro, estados vazios, notificações, diálogos, aria-labels, tooltips e páginas 404/500. Preserve nomes de extensões, formatos e marcas.
9. Não traduza logs de diagnóstico nem mensagens de ferramentas de linha de comando indiscriminadamente. Mostre ao usuário mensagens claras, sem expor caminhos internos ou dados sensíveis.
10. Documente a variável `UI_LANGUAGE` no README do fork e garanta funcionamento no build de produção Docker.

## Testes obrigatórios
- Comparação automatizada de conjuntos de chaves `en` e `pt-BR`, sem ausências.
- Interpolação e pluralização em ambos idiomas.
- Seleção de idioma antes e depois de login, atualização da página, nova sessão.
- Datas e números com padrão brasileiro, fuso e formatação coerentes.
- Layout responsivo: botões, tabelas, diálogos, mensagens extensas e mobile.
- Fluxo de ponta a ponta: upload, seleção de formato, conversão, download, exclusão, histórico, login/logout, erro e arquivo inválido.
- Acessibilidade: labels, `lang`, teclado e leitor de tela.
- Teste de regressão de segurança e de API; não alterar autenticação, rotas nem lógica de conversão.

## Critérios de aceite
- 100% das chaves do catálogo inglês têm tradução pt-BR revisada.
- Nenhum texto literal de interface sem catalogação, verificado por auditoria do código e navegação completa.
- Fallback inglês funciona para chave ausente em desenvolvimento.
- `bun` check/test/build e build Docker passam com as versões reais do upstream.
- Screenshots e checklist manual anexados ao PR.

## Orientação ao agente Cursor
Trabalhe em pequenas etapas, mostre diff por módulo, não invente nomes de arquivos ou APIs, não altere conversores e mantenha a sincronização com upstream. Primeiro faça inventário e proponha arquitetura após ler os fontes atuais; só então modifique. Não declare tradução completa sem executar os testes de cobertura.
