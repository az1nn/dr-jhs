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
- OBSERVED HEAD BEFORE HANDOFF WRITE: `70d57763474ee00f1ac0e0feda099d5b1cec7580`
- STATE: `ADVANCE`
- PR: none
- VERIFIED:
  - default branch is `master`
  - no open pull requests observed
  - social/SEO commit `73ba2cf44a3dcdde7542034eb15d35a77cf4930f` completed canonical Pages workflow run `35518659015` successfully
  - that run passed static smoke, accessibility/HTML integrity, social/SEO integrity, artifact upload and Pages deployment
  - commit `70d57763474ee00f1ac0e0feda099d5b1cec7580` added `scripts/static-route.mjs` and wired it into `.github/workflows/pages.yml`
  - the new gate enforces the expected canonical route `https://az1nn.github.io/dr-jhs/`, the matching `robots.txt` Sitemap directive and the single matching `sitemap.xml` location
  - canonical workflow run `35520900098` for `70d57763474ee00f1ac0e0feda099d5b1cec7580` completed successfully
  - every workflow step was green, including smoke, accessibility, social/SEO, published-route/sitemap, artifact upload and deploy
  - parallel Pages workflow run `35520899323` also completed successfully for the same HEAD
  - direct HTTP inspection of the published GitHub Pages URL was unavailable from the web-inspection environment; publication status is therefore based on GitHub's successful Pages workflow/deploy records
- ACTIVE GATES:
  - none
- DELTA:
  - CI now prevents canonical route, `robots.txt` and `sitemap.xml` from drifting independently
  - no runtime dependency or framework was added
- OPEN WORK:
  - none for the published-route/sitemap consistency unit
- NEXT LOGICAL UNIT:
  - add a lightweight local asset/reference integrity gate that verifies relative HTML/CSS resource references resolve to existing non-empty repository files before deployment
- HUMAN GATES: none known

## Mutation rule

Keep this file procedural and compact. Update only the Current Handoff when operational state changes; change protocol sections only when the user explicitly changes the SIGA contract.
