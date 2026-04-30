# ADR 0001 - MVP funcional com backend como fonte de verdade

## Status

Aceita.

## Contexto

O projeto deixou de ser apenas uma proposta arquitetural e passou a precisar de uma versão funcional do MVP para demonstração. A interface Angular não deve depender de dados mockados para representar projetos, histórico de descoberta ou artefatos, pois isso impede validar o fluxo ponta a ponta descrito na arquitetura.

Para o MVP, a prioridade é demonstrar a jornada completa: criar projeto, registrar ideia, avançar etapas, gerar artefatos, consultar histórico e revisar resultados. Essa versão precisa preservar a arquitetura limpa/hexagonal já proposta, mas sem introduzir complexidade operacional desnecessária, como migrações ou PostgreSQL antes da validação do produto.

## Decisão

O MVP funcional terá o backend FastAPI como fonte de verdade da aplicação. O frontend Angular consumirá a API HTTP para listar e criar projetos, selecionar o projeto ativo, registrar mensagens, avançar etapas, listar histórico, listar artefatos e solicitar geração de artefatos.

A persistência transacional do MVP será feita com SQLite local, acessado por um adaptador de repositório que implementa a porta `ProjectRepository`. O repositório em memória permanece disponível para testes automatizados e cenários isolados. No Docker Compose, o arquivo SQLite deve ser mantido em volume para preservar dados entre reinícios do backend.

ChromaDB continua responsável pela memória vetorial/RAG, e a geração por IA permanece encapsulada por portas e adaptadores. Quando não houver provedor LLM configurado, o comportamento determinístico deve continuar disponível para tornar a demonstração reproduzível.

## Consequências

- A UI deixa de apresentar o fluxo principal como simulação e passa a refletir dados reais retornados pela API.
- O backend precisa expor endpoints suficientes para a jornada do MVP, incluindo listagem de projetos.
- O SQLite atende à demonstração local com baixo custo operacional, mas não substitui a decisão futura de banco transacional para produção.
- A porta de repositório reduz o custo de migração futura para PostgreSQL ou outro banco sem alterar domínio e casos de uso.
- Testes devem cobrir persistência SQLite, endpoints HTTP e integração do frontend com `HttpClient`/mocks HTTP.

## Alternativas Consideradas

- Manter dados mockados no frontend: rejeitado porque validaria apenas a interface, não o fluxo real do MVP.
- Manter somente repositório em memória no backend: rejeitado porque dados seriam perdidos a cada reinício, prejudicando demonstrações e revisão.
- Introduzir PostgreSQL já no MVP: adiado por aumentar a carga operacional antes de validar o fluxo funcional.
