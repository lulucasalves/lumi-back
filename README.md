# Lumi Back-end

Este projeto foi feito para análise recorrente de gastos com enegia elétrica, sendo analisado os boletos que são enviados.

### Infraestrutura do projeto
A infraestrutura do projeto foi feita usando a AWS para amazenar arquivos no serviço de S3, Supabase para fazer deploy do banco de dados Postgres. O deploy e a infraestrutura deveriam ser feitos na AWS, porém por limitações financeiras foram útilizados serviços gratuitos para apresentação do projeto.

### Desenvolvimento
Este projeto foi desenvolvido com Nodejs (Versão 20.3), Nestjs (Versão 10.0), Postgres (Versão 15.1), TypeORM (Versão 0.3) e AWS

Para iniciar o projeto localmente basta digitar o comando `yarn && yarn build && yarn start` ou `npm i && npm build && npm start` e acessar a [porta 3000](http://localhost:3000).

### Deploy

O deploy da aplicação foi no Render,
