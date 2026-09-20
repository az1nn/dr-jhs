# SIGA HANDOFF v1 — dr-jhs

> Fonte procedural e de continuidade canônica deste repositório.
> Não usar memória do chat, Library, outro app ou outro repositório como estado canônico do SIGA deste projeto.

## Objetivo

`SIGA` é a palavra-chave de retomada operacional.

Ao receber apenas **Siga**, o agente NÃO deve interpretar como “faça a próxima coisa”.
Antes de executar trabalho, deve reconstruir o estado real e atual do projeto e decidir automaticamente qual continuação é apropriada.

## Princípio fundamental

**REAL STATE > HANDOFF > MEMORY > CHAT**

A execução começa sempre em **VERIFY-FIRST**.

Para este repositório, esta própria skill é o handoff persistido. O chat pode ajudar a localizar o contexto, mas nunca substitui a verificação do GitHub, arquivos, branches, commits, PRs, Actions e ambiente publicado.

## Start Protocol

### 1. RECONCILE

Reconstruir o estado atual usando fontes verificáveis disponíveis, conforme aplicável:

- repositório, branch default e HEAD;
- branches de trabalho e divergência em relação à base;
- PRs, reviews e comentários;
- commits recentes;
- GitHub Actions, checks, deploys e artefatos;
- arquivos de produto e automação;
- site publicado;
- pendências registradas neste handoff.

Não assumir sucesso por histórico de conversa.

### 2. DECIDE

Classificar exatamente em um dos estados:

- **RESUME** — há trabalho iniciado ou obrigação explícita ainda não concluída.
- **WATCH** — trabalho já foi despachado, mas CI, deploy, review, agente ou outro gate continua ativo.
- **ADVANCE** — o trabalho anterior foi verificavelmente concluído e a próxima unidade lógica está pronta.

Não duplicar trabalho ativo. Não mascarar falhas. Não declarar sucesso sem evidência. Não atravessar gates humanos explícitos.

### 3. EXECUTE

Executar a unidade coerente com a classificação:

**RESUME**
- continuar a pendência existente;
- preservar escopo;
- corrigir falhas reais antes de criar novo workstream.

**WATCH**
- verificar o gate ativo;
- diagnosticar falha quando houver;
- só alterar conteúdo se a evidência exigir correção.

**ADVANCE**
- selecionar a próxima unidade lógica e pequena;
- implementar;
- verificar;
- evitar criar trabalho paralelo desnecessário.

### 4. VERIFY

Após qualquer mutação:

- confirmar novo HEAD;
- verificar arquivos alterados;
- verificar CI/checks/deploy relevantes;
- confirmar comportamento publicado quando aplicável;
- reclassificar estado.

### 5. PERSIST

Atualizar a seção **Current Handoff** deste mesmo arquivo quando houver mudança operacional relevante.

Não criar segunda cópia de skill/estado SIGA.

## CAVEMAN HANDOFF v1

O handoff deve registrar de forma compacta, quando aplicável:

- REPO
- BASE
- OBSERVED HEAD
- BRANCH / ENV
- PR
- STATE
- VERIFIED GATES
- DELTA
- OPEN WORK
- NEXT LOGICAL UNIT
- HUMAN GATES

## Current Handoff

- REPO: `az1nn/dr-jhs`
- BASE: `master`
- OBSERVED HEAD BEFORE HANDOFF WRITE: `5a0eeb0da90fae2b127d9b994f0a22a36a7cf5ca`
- STATE: `WATCH`
- PR: none
- VERIFIED:
  - only branch observed: `master`
  - no pull requests observed
  - commit `a18dbf404d1a9790ec655cd121cbe2e4b39d1cda` added `scripts/static-smoke.mjs`
  - commit `5a0eeb0da90fae2b127d9b994f0a22a36a7cf5ca` runs that smoke check before GitHub Pages configuration/deploy
  - current `index.html` contains the required pt-BR language, meta description, canonical URL, Instagram CTA destination and CRM identification checked by the smoke gate
- DELTA:
  - pre-deploy quality gate now checks required static files
  - critical Instagram CTA destination is contract-tested
  - core page metadata and CRM identification are contract-tested
  - deployment is blocked automatically if the static contract breaks
- OPEN WORK:
  - verify the GitHub Pages push run for `5a0eeb0da90fae2b127d9b994f0a22a36a7cf5ca` reaches success
  - verify the published site remains healthy after that run
- NEXT LOGICAL UNIT:
  - after the deploy is verified green, classify `ADVANCE` and add a lightweight accessibility/HTML integrity quality check without introducing a build framework
- HUMAN GATES: none known

## Mutation rule

Keep this file procedural and compact. Update only the Current Handoff when operational state changes; change protocol sections only when the user explicitly changes the SIGA contract.
