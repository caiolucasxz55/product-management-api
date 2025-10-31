# Product Management API

Este é o backend da **Product Management API**, uma solução para gerenciar produtos, inventário e operações de pequenas/médias empresas.

## 🧩 Tecnologias

- Node.js + TypeScript  
- Prisma como ORM  
- Banco de dados relacional suportado (ex: PostgreSQL, MySQL)  
- Estrutura modular para rotas e serviços de produto  
- Integração com autenticação/controle de acesso (se aplicável)  

## 🚀 Instalação

1. Clone o repositório  
   ```bash
   git clone https://github.com/caiolucasxz55/product-management-api.git
   cd product-management-api
Instale as dependências

bash
Copiar código
npm install
Configure o banco de dados

Crie um arquivo .env baseado em .env.example (se existir)

Defina a variável DATABASE_URL para sua instância de banco de dados

Execute as migrações do Prisma

bash
Copiar código
npx prisma migrate dev
Inicie o servidor em modo de desenvolvimento

bash
Copiar código
npm run dev
📦 Scripts úteis
npm run dev — Inicia o servidor em modo de desenvolvimento

npm run build — Compila o código para produção

npm run start — Inicia o servidor em produção (após build)

npx prisma studio — Abre o painel do Prisma Studio para visualizar/modificar dados

🛠️ Uso
Acesse a rota base da API (ex: http://localhost:3000/api/products)

Configure filtros e parâmetros como categoria, página, ordenação etc.

Endpoints comuns:

GET /api/products — lista produtos

GET /api/products/:id — obtém detalhes de um produto

POST /api/products — cria um novo produto

PUT /api/products/:id — atualiza um produto existente

DELETE /api/products/:id — remove um produto

(Ajuste as rotas conforme a implementação atual.)

🔐 Autenticação & Permissões
Se aplicável, usuários com papel ADMIN podem criar/editar/excluir produtos.
Usuários comuns podem apenas visualizar.
(Implemente/ajuste a autenticação conforme sua camada de segurança.)
