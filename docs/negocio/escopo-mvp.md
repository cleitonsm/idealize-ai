# Escopo Do MVP

## Objetivo Do MVP

O MVP deve validar se uma experiência guiada por IA consegue transformar uma ideia inicial em documentação negocial e técnica consistente. O foco não é cobrir todos os cenários de gestão de produto, mas demonstrar um fluxo coerente de descoberta, memória contextual e geração de artefatos.

## Funcionalidades Incluídas

- Cadastro ou criação simples de um projeto.
- Conversa guiada para coleta da ideia inicial.
- Entrevista simulada com stakeholders por IA.
- Brainstorming assistido.
- Consolidação de problema, solução e proposta de valor.
- Geração de épicos, histórias de usuário e critérios de aceite.
- Geração de análise inicial de mercado, concorrentes e modelo de negócio.
- Geração de diagramas em Mermaid para apoiar modelagem.
- Indexação dos insumos por `project_id` em uma camada RAG.
- Armazenamento em memória para dados transacionais durante o MVP.

## Limites Do MVP

- Não haverá, inicialmente, autenticação corporativa avançada.
- O banco transacional será em memória, com migração futura para PostgreSQL.
- As integrações com ferramentas externas de backlog e documentação ficam fora do primeiro recorte.
- As simulações de stakeholders serão hipóteses e não substituem entrevistas reais.
- A validação de sintaxe e qualidade dos diagramas pode ser incremental.

## Evolução Futura

Após validar o fluxo principal, o produto pode evoluir com persistência em PostgreSQL, autenticação, histórico multiusuário, exportação para ferramentas de gestão ágil, templates por domínio, revisão colaborativa, trilhas de auditoria e avaliação automática de consistência entre requisitos, casos de uso e arquitetura.
