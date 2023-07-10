import { EventSection } from '../event-section';
import { EventSpot } from '../event-spot';
import { Event } from '../event.entity';
import { PartnerId } from '../partner.entity';

test('deve criar um evento', () => {
  const event = Event.create({
    name: 'Evento 1',
    description: 'Descrição do evento 1',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Sessão 1',
    description: 'Descrição da sessão 1',
    total_spots: 100,
    price: 1000,
  });

  expect(event._sections.size).toBe(1);
  expect(event.total_spots).toBe(100);

  const [section] = event._sections;

  expect(section.spots.size).toBe(100);

  // const spot = EventSpot.create();

  // section.spots.add(spot);

  // console.dir(event.toJSON(), { depth: 10 });

  // não é valido
  // customer = new Customer({
  //   id: '123', new CustomerId() || new CustomerId('')
  //   name: 'João',
  //   cpf: '99346413050',
  // });
});

test('deve publicar todos os itens do evento', () => {
  const event = Event.create({
    name: 'Evento 1',
    description: 'Descrição do evento 1',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Sessão 1',
    description: 'Descrição da sessão 1',
    total_spots: 100,
    price: 1000,
  });

  event.addSection({
    name: 'Sessão 2',
    description: 'Descrição da sessão 2',
    total_spots: 1000,
    price: 50,
  });

  event.publishAll();

  expect(event.is_published).toBe(true);

  const [section1, section2] = event._sections.values();
  expect(section1.is_published).toBe(true);
  expect(section2.is_published).toBe(true);

  [...section1.spots, ...section2.spots].forEach((spot) => {
    expect(spot.is_published).toBe(true);
  });
});
