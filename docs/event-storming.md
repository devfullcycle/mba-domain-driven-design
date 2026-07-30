# Event Storming - Lista de Espera

(Anexar imagem real .excalidraw ou .png com sticky notes coloridos conforme o arquivo Event Storming.png da raiz)

## Fluxo Visual (descrição textual para reprodução):

Comandos (laranja):
- Cancelar Pedido (POST orders/{order}/cancel)
- Entrar na Fila (POST sections/{sec}/waiting-list)

Agregados (azul):
- Order
- Event (com chain Section -> Spot)
- WaitingList (filhas: Entry)

Eventos de Domínio (verde):
- OrderCancelled (enriquecido com event_spot_id)
- EventSpotReleased (event_id, section_id, spot_id)
- CustomerJoinedWaitingList
- SpotOfferedToWaitingCustomer

Política (amarelo):
- [EventSpotReleased] --> Se existe WaitingList pendente na seção então WaitingList.offerSpotToNext() --> SpotOffered...

Integração (roxo) cruzando fronteira:
- SpotOfferedToWaitingCustomerIntegrationEvent --> RabbitMQ amq.direct --> apps/emails ConsumerService
