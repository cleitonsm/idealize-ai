# Componentes Do MVP

## Frontend Angular

Responsável por expor a experiência de interação do usuário. Deve conter áreas de chat, formulários guiados, lista de etapas, visualização de artefatos gerados e renderização de diagramas Mermaid.

## Backend FastAPI

Responsável por receber comandos do frontend, validar dados de entrada, acionar casos de uso e retornar artefatos estruturados. Deve manter as integrações externas isoladas por portas e adaptadores.

## Orquestrador LangGraph

Controla o fluxo de estado do projeto. O orquestrador decide a próxima etapa, identifica quando faltam insumos e aciona os nós especializados. Ele deve registrar saídas relevantes para que sejam usadas como memória nas etapas seguintes.

## PO Agent

Agente voltado à dimensão negocial. Deve conduzir entrevistas simuladas, brainstorming, análise de problema e solução, criação de épicos, histórias de usuário e critérios de aceite.

## Solution Architect Agent

Agente voltado à dimensão técnica. Deve apoiar definição de stack, modelagem, diagramas e justificativas arquiteturais. Suas respostas devem considerar os requisitos gerados pelo PO Agent e o contexto recuperado por RAG.

## Camada RAG

Responsável por indexar e recuperar insumos do projeto. No MVP, ChromaDB deve armazenar documentos vetorizados por `project_id`, permitindo que requisitos e modelos sejam fundamentados em conteúdo previamente coletado.

## Armazenamento Em Memória

Armazena dados transacionais temporários do MVP, como projetos, etapas, artefatos e status de fluxo. A implementação deve ser simples, mas escondida atrás de uma porta de repositório para migração futura.

## Geração Documental

Componente responsável por consolidar saídas em Markdown, Mermaid e PlantUML. Deve preservar rastreabilidade entre os artefatos finais e os insumos usados para sua geração.
