# RAG E Memória

## Objetivo

A camada de RAG deve garantir que os insumos produzidos em uma etapa sejam reutilizados nas etapas seguintes. Isso permite que histórias de usuário, business case, modelagem e decisões técnicas sejam fundamentados no contexto acumulado do projeto.

## Indexação Por Projeto

Cada conteúdo relevante deve ser indexado com `project_id`. Essa chave separa a memória de diferentes projetos e permite recuperar apenas o contexto pertinente à geração atual.

Metadados recomendados:

- `project_id`: identificador do projeto.
- `stage`: etapa de origem, como entrevista, brainstorming ou requisitos.
- `artifact_type`: tipo de artefato, como transcrição, hipótese, user story ou diagrama.
- `source_role`: papel associado, como usuário, stakeholder simulado, PO Agent ou Architect Agent.
- `created_at`: data de criação do insumo.

## Conteúdos Indexáveis

- Transcrições de entrevistas.
- Respostas de questionários e pesquisas simuladas.
- Observações e hipóteses.
- Resultados de brainstorming.
- Problemas, soluções e propostas de valor.
- Épicos, histórias e critérios de aceite.
- Decisões arquiteturais e diagramas gerados.

## Recuperação Semântica

Antes de gerar novos artefatos, o caso de uso deve consultar a memória vetorial com filtros por `project_id` e, quando necessário, por `stage` ou `artifact_type`. O resultado recuperado deve ser enviado ao prompt como contexto, preferencialmente com indicação de origem para facilitar rastreabilidade.

## Exemplo De Uso

Após o nó de entrevistas, o texto é vetorizado e salvo no ChromaDB. Quando o nó de requisitos for executado, ele faz busca semântica por dores, objetivos e falas relevantes. As user stories geradas devem refletir esse material, evitando requisitos desconectados da descoberta inicial.

## Cuidados

A memória RAG não deve ser tratada como verdade absoluta. Ela recupera contexto provável e relevante, mas o sistema deve permitir revisão humana e registrar incertezas quando houver baixa confiança, conflito entre insumos ou ausência de evidência suficiente.
