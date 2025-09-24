# myNovelReam

myNovelReam é uma plataforma para criação, publicação e leitura de novels, construída com [Bun](https://bun.sh/), [Elysia](https://elysiajs.com/), [Drizzle ORM](https://orm.drizzle.team/), e autenticação via [Better Auth](https://better-auth.dev/).

## Funcionalidades

- Cadastro e autenticação de usuários
- Criação de novels com upload de capa
- Upload de capítulos em arquivos (PDF, DOC, DOCX)
- Listagem de novels e capítulos
- API documentada via OpenAPI/Swagger
- Armazenamento local de arquivos enviados

## Estrutura do Projeto

```
.
├── src/
│   ├── application/         # Casos de uso (use-cases)
│   ├── domain/              # Entidades e interfaces de domínio
│   ├── infrastructure/      # Persistência, adapters, plugins, controllers HTTP
│   ├── interfaces/          # Controllers de rotas
│   └── index.ts             # Ponto de entrada da aplicação
├── uploads/                 # Arquivos enviados (capas, capítulos)
├── scripts/                 # Scripts utilitários
├── .env                     # Variáveis de ambiente
├── package.json
└── README.md
```

## Como rodar localmente

1. **Clone o repositório e instale as dependências:**

   ```sh
   bun install
   ```

2. **Configure o banco de dados:**

   - Use o `docker-compose.yml` para subir um PostgreSQL local:
     ```sh
     docker-compose up -d
     ```

3. **Configure o arquivo `.env`:**

   - Exemplo:
     ```env
     BETTER_AUTH_SECRET=suachavesecreta
     BETTER_AUTH_URL=http://localhost:3000
     DATABASE_URL=postgresql://docker:docker@localhost:5432/mynovelream
     ```

4. **Rode as migrações:**

   ```sh
   bun run src/infrastructure/db/run-migrations.ts
   ```

5. **Inicie o servidor:**

   ```sh
   bun run src/index.ts
   ```

6. **Acesse a API:**
   - Documentação OpenAPI: [http://localhost:3000/openapi](http://localhost:3000/openapi)
   - Uploads: [http://localhost:3000/uploads/](http://localhost:3000/uploads/)

## Scripts úteis

- `bun run scripts/list-tables.ts` — Lista as tabelas do banco de dados
