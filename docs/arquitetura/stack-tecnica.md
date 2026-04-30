# Stack Técnica

## Status Da Stack

A stack descrita neste documento sustenta a versão funcional do MVP, com frontend Angular, backend FastAPI, ChromaDB para RAG e persistência transacional local em SQLite.

## Frontend

O frontend proposto é Angular. Ele deve oferecer interface reativa para chat, formulários dinâmicos, acompanhamento das etapas, dashboards de artefatos e visualização de diagramas Mermaid. A escolha é adequada para uma aplicação com fluxo estruturado, componentes reutilizáveis e necessidade de organização modular.

## Backend

O backend proposto é FastAPI em Python. A escolha favorece criação rápida de APIs, tipagem com modelos de dados, documentação automática de endpoints e integração natural com bibliotecas de IA em Python.

## Orquestração De IA

LangGraph deve controlar o fluxo de estados entre etapas como entrevista, brainstorming, requisitos, business case, definição de stack e modelagem. LangChain pode ser usado como suporte para prompts, chamadas ao modelo, recuperação de contexto e composição de cadeias de processamento.

## Memória E RAG

ChromaDB é a vector store proposta para o MVP. Ela deve armazenar transcrições, decisões, resultados de brainstorming e artefatos intermediários com metadados como `project_id`, `stage`, `artifact_type` e `created_at`.

## Persistência Transacional

No MVP funcional, o banco transacional padrão é SQLite local para preservar projetos, mensagens e artefatos entre reinícios. A arquitetura preserva uma porta de repositório para permitir migração futura para PostgreSQL sem alterar os casos de uso centrais. O repositório em memória permanece útil para testes automatizados.

## Ambiente

Docker deve ser usado para padronizar o ambiente local. A composição esperada inclui serviços para frontend Angular, backend FastAPI e ChromaDB. Durante a implementação, também poderão ser adicionados serviços auxiliares para observabilidade, testes ou banco PostgreSQL em etapas futuras.
