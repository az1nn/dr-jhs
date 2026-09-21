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
- OBSERVED HEAD BEFORE HANDOFF WRITE: `fa2bc6265ad1bab22697d0f83fb34916c0fd7add`
- STATE: `ADVANCE`
- PR: none
- VERIFIED:
  - default branch is `master`
  - no active or queued workflow gates remained after verification
  - historical failed `Deploy GitHub Pages` runs were superseded by later successful runs
  - commit `fa2bc6265ad1bab22697d0f83fb34916c0fd7add` atomically changed exactly:
    - `.github/workflows/pages.yml`
    - `README.md`
    - `scripts/static-conversion.mjs`
  - the new conversion/telemetry gate validates:
    - all tracked Instagram CTAs target `https://ig.me/m/medicinal_cann`
    - required unique `data-cta` placements: `header`, `hero`, `final`, `mobile-sticky`
    - the `#leadAssist` form hook and both `modalidade` options
    - `instagram_click` placement metadata and `lead_assist_submit`
    - UTM keys `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
    - local attribution storage key `jhs_attribution`
    - README documentation remains aligned with the runtime contract
  - canonical workflow run `35656059857` completed successfully for `fa2bc6265ad1bab22697d0f83fb34916c0fd7add`
  - every canonical workflow step was green, including the new conversion/telemetry contract gate, artifact upload and deploy
  - dynamic Pages run `35656058810` also completed successfully for the same HEAD
- ACTIVE GATES:
  - none
- DELTA:
  - CI now prevents accidental breakage of the existing Instagram conversion and attribution contract before deployment
  - telemetry contract is explicitly documented without adding GTM/GA4 or new runtime dependencies
  - no product copy, styling or medical-content behavior was changed
- OPEN WORK:
  - none for the conversion/telemetry contract unit
- NEXT LOGICAL UNIT:
  - add a lightweight static privacy/data-minimization gate that asserts the lead-assist flow remains non-clinical and local-only: no free-text health fields, no email/phone capture, no remote form action, and no fetch/XHR/beacon submission path
- HUMAN GATES: none known

## Mutation rule

Keep this file procedural and compact. Update only the Current Handoff when operational state changes; change protocol sections only when the user explicitly changes the SIGA contract.
