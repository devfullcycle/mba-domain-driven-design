# Linguagem Ubíqua - Lista de Espera de Ingressos

- **Lista de Espera (WaitingList)**: Agregado que representa a fila de clientes aguardando por uma vaga em uma seção esgotada de um evento. Identificada por event_id + section_id.
- **Entrada (WaitingListEntry)**: Entidade filha da WaitingList que representa um cliente pendente na fila, com status PENDING ou NOTIFIED e ordem de chegada.
- **Notificação**: Ação de promover a primeira entrada PENDING para NOTIFIED quando um lugar é liberado, registrando o evento SpotOfferedToWaitingCustomer.
- **Liberação de Lugar (EventSpotReleased)**: Evento de domínio emitido pelo agregado Event quando um spot volta a estar disponível após cancelamento de pedido.
- **Trava de Reserva (SpotReservation)**: Entidade que bloqueia um spot para o cliente durante o fluxo de compra.
- **Cancelamento de Pedido (OrderCancelled)**: Evento de domínio disparado pelo agregado Order contendo agora o event_spot_id; inicia a cadeia de liberação.
- **Oferta de Vaga (SpotOfferedToWaitingCustomerIntegrationEvent)**: Evento de integração que cruza o contexto para o bounded context de Emails, permitindo notificação assíncrona via RabbitMQ.
- **Política (EventSpotReleased -> WaitingList)**: Handler que reage ao EventSpotReleased, localiza a fila da seção e promove o primeiro cliente.
- **Esgotamento (Sold Out)**: Estado de uma seção derivado dinamicamente de não existência de spots published e !reserved (não usa contador total_spots_reserved).

Todos os nomes de classes, métodos e eventos seguem exatamente os termos acima.
