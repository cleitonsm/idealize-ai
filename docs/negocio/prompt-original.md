# Prompt Original

Contexto: Estou projetando um sistema no qual quero desenvolver um sistema que tem por objetivo de ser um co-piloto assumindo o papel de Product Owner e Arquiteto de solução para ajudar de forma guiada na construção de insumos negociais e técnicos para o desenvolvimento de sistema. O sistema deve de forma inovadora oferecer:
* Entrevistas (simulando papéis Com IA)
* Observação
* Questionários e Pesquisas (simulado com IA)
* Brainstorming
* Casos de uso
* Modelagem (Diagramas de Classe/Estado)

O sistema deve usar como base o método scrum

O sistema deve usar chat com IA mas oferecer também mas que permitam a interação do usuário.
Os insumos produzidos em cada etapa devem ser usados como RAG para construção de rodas as etapas.
Ao final o sistema deve entregar documentos com justificativas, requisitos estruturados Em epics, User Story. Deve apresentar também documentos que mostrem :
Problema a ser resolvido
Solução
Mercado
Modelo de negócio
Concorrentes
Equipe

Estilo: Crie uma estrutura de pastas para documentação (docs/negocio e docs/arquitetura) na parte negocial crie arquivos em markdown que descrevam bem o objetivo do sistema e o que ele resolve de maneira bem fundamentada. E guarde esse prompt nessa pasta para servir de análise futura. Na parte técnica descreva com base na stack e na solução o modelo arquitetural mais adequado (Clean Architecture, Hexagonal) para a solução proposta. Apresente O sistema deve apresentar diagrama c4-plantUML.

Resposta: Arquivos markcown e mermeid para a arquitetura

Descrição: Para o MVP, o diagrama de componentes ilustra comunicação entre frontend (Angular) e backend (FastAPI), o Backend por sua vez interage com um banco de dados em memória (migração futura para PostgreSQL).

O sistema será dividido em duas grandes camadas: o Core de Orquestração (Backend) e a Interface de Interação (Frontend).
Componentes Principais:
Frontend (Angular): Interface reativa com dashboards para visualização de diagramas (Mermaid.js), áreas de chat e formulários dinâmicos.
Orquestrador (LangGraph): Controla o fluxo de estado. Ele decide se o usuário deve avançar para a próxima etapa (ex: de Brainstorming para Casos de Uso) ou se precisa de mais insumos.
Camada de Memória/RAG (Vector Database): Armazena cada transcrição de entrevista, resultado de brainstorming e protótipo para que as etapas futuras tenham contexto total do que foi decidido.

Definição do Grafo de Fluxo:
Nível de Negócio (PO Agent):

node_interview: Simula stakeholders (CEO, Usuário Final, Investidor) para validar a dor.
node_brainstorming: Expande ideias com técnicas como Mind Mapping.
node_requirements: Consolida insumos em Epics e User Stories.
node_business_case: Gera análise de mercado, concorrentes e modelo de receita.
Nível Técnico (Solution Architect Agent):
node_stack_definition: Escolhe linguagens, bancos e infraestrutura.
node_modeling: Gera código Mermaid para Diagramas de Classe e Sequência.

Implementação Técnica (Python & LangChain)
Estrutura do Estado (State Definition)
No LangGraph, definimos o que o sistema "lembra" durante a execução.

O Agente de IA (Exemplo de Nó de Entrevista)
Cada nó usará um PromptTemplate específico que assume o papel necessário.

Estrutura de Dados e RAG
Para que o sistema seja "sistêmico", cada saída de um nó deve ser indexada.
Store: Utilize o ChromaDB.
Processo: Assim que o nó de "Entrevistas" termina, o texto é vetorizado com a tag project_id. No nó de "User Stories", o agente faz uma busca semântica para garantir que cada história de usuário esteja fundamentada em uma fala da entrevista.

Utilize o Docker para configurar todo o ambiente

Monte o planejamento para construir a documentação e após a minha validação dos documentos vamos iniciar o desenvolvimento
