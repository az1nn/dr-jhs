# Dr. JHS — Landing Page

Landing page estática, mobile-first, para **Dr. João Henrique Senna — CRM-MG 80217**.

## Objetivos

- Conversão para atendimento via Instagram Direct (`@medicinal_cann`)
- Atendimento online em todo o Brasil e presencial em Belo Horizonte/MG
- Performance alta em GitHub Pages
- SEO técnico + JSON-LD
- UTM persistence e eventos `dataLayer` prontos para GTM/GA4
- Sem coleta de dados de saúde no site

## Ajuste responsivo da identidade visual

A logo principal do hero foi dimensionada separadamente para desktop, tablet e mobile, com `object-fit: contain`, proporção 1:1 e espaço reservado acima do card de identificação. Isso evita corte, excesso de escala e sobreposição com a faixa de CRM.

## Publicação no GitHub Pages

1. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
2. O workflow `.github/workflows/pages.yml` publicará automaticamente a cada push.

URL prevista: `https://az1nn.github.io/dr-jhs/`

## Conversão

Todos os CTAs direcionam para `https://ig.me/m/medicinal_cann`.
O assistente de contato copia uma mensagem curta para a área de transferência e abre o Instagram, sem solicitar sintomas, diagnóstico ou outros dados sensíveis.

## Nota editorial

Evite promessas de cura, garantias de resultado ou comunicação que trate prescrição como automática. A página foi escrita com foco informativo e em avaliação médica individualizada.
