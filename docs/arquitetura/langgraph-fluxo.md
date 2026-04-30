# Fluxo LangGraph

## Papel Do Grafo

O LangGraph deve representar o fluxo de descoberta, análise e modelagem do Idealize AI. Cada nó executa uma etapa especializada, atualiza o estado do projeto e gera insumos que podem ser persistidos e indexados.

## Estado Conceitual

O estado do grafo deve conter, no mínimo:

- identificação do projeto;
- objetivo ou ideia inicial;
- histórico de interações;
- artefatos gerados;
- etapa atual;
- pendências e perguntas abertas;
- referências recuperadas pela camada RAG.

## Nós Do PO Agent

### `node_interview`

Simula entrevistas com stakeholders como CEO, usuário final e investidor. O objetivo é explorar dor, motivação, restrições, expectativas e critérios de sucesso.

### `node_brainstorming`

Expande alternativas de solução e funcionalidades por técnicas como mind mapping, perguntas provocativas e agrupamento de ideias.

### `node_requirements`

Consolida os insumos em épicos, histórias de usuário, critérios de aceite, riscos e dependências. Deve consultar o RAG para manter aderência ao contexto do projeto.

### `node_business_case`

Gera análise inicial de problema, solução, mercado, concorrentes, modelo de negócio e equipe necessária.

## Nós Do Solution Architect Agent

### `node_stack_definition`

Propõe linguagens, frameworks, bancos, integrações e infraestrutura. No MVP do Idealize AI, parte da hipótese é Angular, FastAPI, LangGraph, LangChain, ChromaDB e Docker.

### `node_modeling`

Gera modelos técnicos, como diagramas Mermaid, diagramas C4 e eventuais diagramas de classe, estado ou sequência.

## Transições

As transições devem considerar suficiência de informação. Se uma etapa não tiver dados mínimos, o grafo pode retornar ao usuário com perguntas complementares. Quando houver insumo suficiente, o fluxo avança para a próxima etapa e registra a saída na memória do projeto.
