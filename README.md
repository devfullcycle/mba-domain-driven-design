# MBA Full Cycle - Domain Driven Design

Este repositório contém o código-fonte e material didático do curso de Domain Driven Design do MBA Full Cycle.

O projeto é feito com Nestjs, mas o conteúdo é independente de linguagem ou framework.

## Pré-requisitos

- Node.js 18+
- Docker

## Executar o projeto

Suba as aplicações MySQL, RabbitMQ e Redis:

```bash
docker-compose up -d
```

Instale as dependências do Node.js:

```bash
npm install
```

Use o arquivo `api.http` como referência para fazer as requisições HTTP. Este arquivo funciona com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VSCode.

## Professor

<a href="https://github.com/argentinaluiz">
    <img src="https://avatars.githubusercontent.com/u/4926329?v=4?s=100" width="100px;" alt=""/>
    <br />
    <sub>
        <b>Luiz Carlos</b>
    </sub>
</a>

## Instruções para Desenvolvimento e Testes da Feature de Lista de Espera

```bash
docker-compose up -d
npx mikro-orm schema:fresh --run   # sempre após testes
npm run start:dev
npx nest start emails
```

Para rodar testes: `npm test`. Após suite, rode schema:fresh novamente.

**Justificativa da fronteira do agregado `WaitingList`**:
Seguindo a discussão do curso sobre tamanho de agregados (regra do Aggregate deve ser pequeno e coeso, encapsular invariantes transacionais), a WaitingList foi modelada como agregado separado do Event. Um Event já é raiz complexa (contém coleção de Sections com Spots e invariantes de publicação/reserva), adicionar a fila de espera (com ordenação e promoção) aumentaria o tamanho além do limite razoável e misturaria responsabilidades de venda imediata com espera assíncrona. A relação é por ID (event_id + section_id), nunca por referência de objeto, mantendo consistência eventual via eventos de domínio e handlers.

**Cadeia completa do cancelamento**:
1. Controller invoca OrderService.cancel() dentro de ApplicationService.run()
2. Order.cancel() registra OrderCancelled (com event_spot_id)
3. Handler OrderCancelledHandler reage: encontra Event por spot, chama markSpotAsAvailable -> remove reserva -> publica EventSpotReleased
4. Handler EventSpotReleasedHandler reage: localiza WaitingList da seção, chama offerSpotToNext -> marca NOTIFIED e registra SpotOfferedToWaitingCustomer
5. publishForIntegrationEvent gera SpotOffered...IntegrationEvent -> fila Bull -> IntegrationEventsPublisher -> RabbitMQ -> ConsumerService (apps/emails) loga

Artefatos:
- `docs/event-storming.md`
- `docs/linguagem-ubiqua.md`

A feature está 100% alinhada com o event storming feito antes da codificação.
