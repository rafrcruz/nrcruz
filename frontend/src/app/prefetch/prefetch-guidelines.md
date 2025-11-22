# Guia rápido de prefetch de componentes e dados

Use este guia para decidir quando ativar prefetch e como manter a experiência responsiva, em especial em redes móveis.

## Quando usar prefetch
- Em telas/componentes com alta probabilidade de navegação imediata (hover/focus em links principais, elementos acima da dobra visíveis no viewport).
- Quando o bundle ou resposta é pequeno e rápido de baixar (componentes específicos, listas resumidas).
- Para rotas críticas que costumam ser acessadas logo após o carregamento inicial.
- Em sinais de intenção claros (passar o mouse, foco por teclado, interseção no viewport) em vez de disparar automaticamente ao montar a página.

## Quando **não** usar prefetch
- Em componentes pesados ou páginas raramente visitadas.
- Em ações especulativas sem intenção clara do usuário.
- Durante operações em background ou quando o usuário está fazendo upload/download de algo importante.
- Quando a tela depende de dados altamente dinâmicos que podem ficar obsoletos antes da navegação.

## Boas práticas para mobile
- Prefira prefetch somente sob Wi‑Fi ou conexões rápidas quando essa detecção existir.
- Evite disparar vários prefetches em paralelo; priorize um de cada vez.
- Mantenha o tamanho dos assets/payloads baixo para não consumir franquia de dados.
- Respeite sinais de economia de dados ou modo baixo consumo quando disponíveis.

## Evite prefetch agressivo
- Não conecte prefetch a todos os links simultaneamente; selecione apenas os caminhos mais prováveis.
- Limite a quantidade de recursos baixados antecipadamente e cancele prefetches irrelevantes em mudanças de rota.

## Prefetch em massa
- Não faça prefetch em lote de várias telas; escolha 1–2 próximos passos da jornada.
- Reavalie periodicamente quais rotas continuam fazendo sentido para prefetch com base em telemetria.

## Checklist rápido
- [ ] O usuário demonstrou intenção (hover/focus/viewport)?
- [ ] O componente é pequeno e rápido de carregar?
- [ ] Existe alta probabilidade de navegação imediata?
- [ ] O prefetch não vai competir com ações principais nem congestionar a rede?
