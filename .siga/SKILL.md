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
- OBSERVED HEAD BEFORE HANDOFF WRITE: `73ba2cf44a3dcdde7542034eb15d35a77cf4930f`
- STATE: `WATCH`
- PR: none
- VERIFIED:
  - default branch is `master`
  - no pull requests observed
  - prior accessibility-gate deploy for commit `7825ca620fddbc18d8c79cf23101f66d83af7e07` completed successfully in canonical workflow run `35516680184`
  - that run passed static smoke, accessibility/HTML integrity, artifact upload and Pages deployment; GitHub reported the published environment URL as `https://az1nn.github.io/dr-jhs/`
  - parallel legacy Pages run `35516679783` was cancelled before executing steps and did not replace the successful canonical deployment
  - commit `73ba2cf44a3dcdde7542034eb15d35a77cf4930f` atomically changed exactly:
    - `.github/workflows/pages.yml`
    - `index.html`
    - `scripts/static-seo.mjs`
  - new metadata contract requires canonical/og:url consistency, absolute HTTPS Open Graph image, matching Twitter metadata and JSON-LD URL/image consistency
- ACTIVE GATES:
  - deployment verification for HEAD `73ba2cf44a3dcdde7542034eb15d35a77cf4930f` is pending
  - current GitHub connector can inspect workflow jobs by run ID but does not expose push-run discovery by commit SHA; no green conclusion for this HEAD has been claimed
- DELTA:
  - Open Graph image is now absolute
  - `og:url`, Twitter title/description/image and JSON-LD `url` were added
  - Pages deployment now runs `scripts/static-seo.mjs` after smoke and accessibility gates
- OPEN WORK:
  - discover the canonical Pages push run for HEAD `73ba2cf44a3dcdde7542034eb15d35a77cf4930f`
  - verify smoke, accessibility/HTML integrity, social/SEO gate and Pages deployment all complete successfully
  - diagnose any failed step before new product work
- NEXT LOGICAL UNIT:
  - once HEAD is green and published, classify `ADVANCE` and add a lightweight published-route/sitemap consistency gate so canonical URL, robots.txt and sitemap.xml cannot drift
- HUMAN GATES: none known

## Mutation rule

Keep this file procedural and compact. Update only the Current Handoff when operational state changes; change protocol sections only when the user explicitly changes the SIGA contract.
