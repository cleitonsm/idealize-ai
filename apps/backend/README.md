# Backend

Aplicacao FastAPI do Idealize AI.

Organizacao prevista:

- `domain`: entidades, value objects, eventos e regras de negocio puras.
- `application`: casos de uso, DTOs, portas e workflows de aplicacao.
- `adapters`: implementacoes de entrada e saida, como HTTP, LangGraph, LLM, RAG e repositorios.
- `infrastructure`: configuracao, logging e injecao de dependencias.
- `tests`: testes unitarios, de integracao e de contrato.
