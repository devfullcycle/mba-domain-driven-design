import { Name } from './name.vo';

test('deve criar um nome válido', () => {
  const name = new Name('aaaaaa');
  expect(name.value).toBe('aaaaaa');
});
