import { Component, inject, signal } from '@angular/core';

import { ProjectContextService } from '../../core/services/project-context.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { MermaidViewerComponent } from '../../shared/ui/mermaid-viewer.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiTextareaComponent } from '../../shared/ui/ui-textarea.component';

const SAMPLE_CONTEXT = `flowchart LR
  U[Usuário] --> A[Web Angular]
  A --> B[API FastAPI]
  B --> C[LangGraph]
  C --> D[LLM]
  B --> E[(ChromaDB)]
`;

@Component({
  selector: 'app-diagrams-page',
  imports: [
    UiCardComponent,
    MermaidViewerComponent,
    UiTextareaComponent,
    UiButtonComponent,
    EmptyStateComponent,
  ],
  template: `
    @if (!projects.activeProject()) {
      <app-empty-state
        title="Nenhum projeto ativo"
        description="Escolha um projeto em Projetos para associar diagramas futuros ao contexto."
      />
    } @else {
      <div class="mx-auto flex max-w-5xl flex-col gap-6">
        <app-ui-card
          title="Diagramas Mermaid"
          subtitle="Alterne entre fonte e visualização. Conteúdo de exemplo; persistência virá com a API."
        >
          <div class="flex flex-wrap gap-2 border-b border-border pb-4">
            <app-ui-button [variant]="mode() === 'render' ? 'primary' : 'secondary'" (clicked)="mode.set('render')">
              Visualização
            </app-ui-button>
            <app-ui-button [variant]="mode() === 'source' ? 'primary' : 'secondary'" (clicked)="mode.set('source')">
              Fonte
            </app-ui-button>
            <app-ui-button variant="ghost" type="button" (clicked)="resetSample()">Carregar exemplo</app-ui-button>
          </div>

          @if (mode() === 'source') {
            <app-ui-textarea
              label="Definição Mermaid"
              hint="Use sintaxe suportada pelo Mermaid (fluxos, sequência, classe, etc.)."
              [rows]="14"
              [value]="source()"
              (valueChange)="source.set($event)"
            />
          } @else {
            <app-mermaid-viewer [definition]="source()" />
          }
        </app-ui-card>
      </div>
    }
  `,
})
export class DiagramsPage {
  protected readonly projects = inject(ProjectContextService);

  protected readonly mode = signal<'render' | 'source'>('render');
  protected readonly source = signal(SAMPLE_CONTEXT);

  protected resetSample(): void {
    this.source.set(SAMPLE_CONTEXT);
  }
}
