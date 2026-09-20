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
- OBSERVED HEAD BEFORE HANDOFF WRITE: `7825ca620fddbc18d8c79cf23101f66d83af7e07`
- STATE: `WATCH`
- PR: none
- VERIFIED:
  - only branch observed: `master`
  - no pull requests observed
  - prior smoke-gate commit `5a0eeb0da90fae2b127d9b994f0a22a36a7cf5ca` completed both Pages runs successfully:
    - Deploy GitHub Pages `35516297363`: success
    - pages build and deployment `35516296724`: success
  - commit `7825ca620fddbc18d8c79cf23101f66d83af7e07` atomically added `scripts/static-a11y.mjs` and wired it before Pages deployment
  - new gate checks doctype/viewport, single h1/main, landmarks, unique IDs, fragment targets, image alt attributes, safe target=_blank rel values, explicit button types, skip link, form legend, live status region and heading hierarchy
- ACTIVE GATES:
  - Deploy GitHub Pages run `35516680184`: in_progress
  - pages build and deployment run `35516679783`: in_progress
- DELTA:
  - deployment now blocks on both the existing product smoke contract and the new accessibility/HTML integrity contract
  - no application runtime framework or external dependency was introduced
- OPEN WORK:
  - verify both runs for `7825ca620fddbc18d8c79cf23101f66d83af7e07` reach success
  - if a gate fails, diagnose the failed step before any new product work
- NEXT LOGICAL UNIT:
  - once both runs are green, classify `ADVANCE` and add a lightweight social/SEO metadata integrity gate covering absolute Open Graph image URL, Twitter metadata and structured-data URL consistency
- HUMAN GATES: none known

## Mutation rule

Keep this file procedural and compact. Update only the Current Handoff when operational state changes; change protocol sections only when the user explicitly changes the SIGA contract.
