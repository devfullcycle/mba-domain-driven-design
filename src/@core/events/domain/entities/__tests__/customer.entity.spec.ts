import { Customer } from '../customer.entity';

test('deve criar um cliente', () => {
  const customer = Customer.create({
    name: 'João',
    cpf: '99346413050',
  });
  
});
