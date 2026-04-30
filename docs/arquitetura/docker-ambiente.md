# Docker E Ambiente Local

## Objetivo

O ambiente local deve ser configurado com Docker para reduzir diferenças entre máquinas, facilitar onboarding e permitir execução integrada dos serviços do MVP. Este documento descreve a composição esperada, ainda sem criar arquivos de configuração.

## Serviços Previstos

### Frontend

Serviço Angular responsável pela interface web. Durante o desenvolvimento, deve expor a aplicação em uma porta local e consumir a API do backend.

### Backend

Serviço FastAPI responsável por APIs, casos de uso, orquestração com LangGraph e integração com provedores de IA, vector store e persistência.

### ChromaDB

Serviço de vector store para armazenamento dos embeddings e recuperação semântica dos insumos por projeto.

### Banco Transacional

No MVP, a persistência transacional pode ser em memória no próprio backend. Em evolução futura, um serviço PostgreSQL deve ser adicionado ao ambiente.

## Variáveis De Ambiente Esperadas

- `LLM_PROVIDER`: provedor de IA usado pelo backend.
- `LLM_API_KEY`: chave de acesso ao provedor de IA.
- `CHROMA_HOST`: host do serviço ChromaDB.
- `CHROMA_PORT`: porta do serviço ChromaDB.
- `APP_ENV`: ambiente de execução, como local, test ou production.

## Rede E Comunicação

O frontend deve se comunicar com o backend por HTTP. O backend deve se comunicar com o ChromaDB pela rede interna do Docker. A comunicação com o provedor LLM ocorre externamente, usando credenciais configuradas por variável de ambiente.

## Diretriz Para Implementação

Quando a aplicação for criada, o `docker-compose.yml` deve ser mantido simples no MVP: frontend, backend e ChromaDB. Serviços adicionais devem ser incluídos apenas quando houver necessidade concreta de persistência, observabilidade ou testes de integração.
