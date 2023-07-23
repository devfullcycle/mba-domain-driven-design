# Javascript
Sequelize - Active Record 
Prisma - Active Record
TypeORM - Active Record / Data Mapper * (Unit of Work)
Knex - queries mais de baixo de nível
Bookshelf - Active Record
Mikro ORM - Data Mapper

# Python
Django ORM - Active Record


# Ruby
Rails - Active Record

# Java
Hibernate - Data Mapper

# PHP
Doctrine - Data Mapper
Eloquent - Active Record

# .Net
Entity Framework - Data Mapper


# Active Record vs Data Mapper


# Dúvidas gerais

## Regras dos agregados

- Um agregado é uma transação atômica
- Um agregado protege invariantes de consistência
- Um agregado referência outros agregados por identidade
- Somente um agregado deve ser processado por transação

## Razões para quebrar as regras dos agregados

- Conveniência da Interface do Usuário
- A falta de mecanismos técnicos ou restrições de negócios
- Transações globais (legados)
- Desempenho das consultas (referências)