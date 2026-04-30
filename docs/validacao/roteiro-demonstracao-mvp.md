# Roteiro de demonstracao do MVP

Este roteiro valida a jornada minima do Idealize AI com dados deterministico e revisao humana dos artefatos. Ele deve ser executado localmente antes de considerar a demonstracao pronta.

## Preparacao

1. Subir backend, frontend e ChromaDB conforme `infra/README.md`.
2. Confirmar que `GET /health` retorna `{"status":"ok"}`.
3. Usar os dados de exemplo em `docs/validacao/dados-exemplo-mvp.json` como insumo principal.
4. Executar as suites automatizadas:
   - Backend: `pytest`
   - Frontend: `npm test -- --watch=false --browsers=ChromeHeadless`

## Fluxo feliz

1. Criar o projeto "Clinica Conecta".
   - Resultado esperado: projeto nasce em `initial_idea`.
2. Registrar a ideia inicial com o texto de `initialIdea`.
   - Resultado esperado: a mensagem e indexada no RAG com metadados de projeto e etapa.
3. Avancar sequencialmente por todas as etapas: entrevista, brainstorming, requisitos, business case, stack, modelagem e revisao.
   - Resultado esperado: transicoes fora da ordem sao rejeitadas e a etapa final nao avanca.
4. Gerar artefatos nas etapas correspondentes:
   - Entrevista: problema/solucao.
   - Brainstorming: proposta de valor.
   - Requisitos: epico, historia de usuario e criterios de aceite.
   - Business case: analise de mercado e modelo de negocio.
   - Modelagem: diagrama Mermaid.
5. Listar artefatos e historico.
   - Resultado esperado: artefatos retornam `status=generated`, `sourceContext`, metadados de trace e metadados RAG; historico mantem a mensagem inicial.
6. Abrir o frontend e validar visualmente:
   - Projetos: criacao e selecao do projeto ativo.
   - Descoberta guiada: timeline, conversa simulada e mudanca de etapa.
   - Artefatos: cards com status, tipo, etapa e contexto/evidencia.
   - Diagramas: alternancia entre fonte Mermaid e visualizacao.
   - Revisao: tela de consolidacao disponivel.

## Criterios de aceite

- A API cobre sucesso, validacao, recurso inexistente e transicao invalida.
- O RAG isola contexto por `project_id`.
- Os artefatos gerados sao rastreaveis por `prompt_id`, no LangGraph e etapa.
- O frontend exibe os estados essenciais de loading/empty/content usando dados mockados ate a integracao HTTP.
- A demonstracao pode ser repetida sem depender de LLM externo.
