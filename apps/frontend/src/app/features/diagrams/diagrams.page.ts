import { Component, computed, inject, signal } from '@angular/core';

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
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">Diagramas</p>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Modele fluxos Mermaid com visualização imediata.
          </h2>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Use a alternância entre fonte e renderização para validar a clareza dos diagramas gerados.
          </p>
        </div>
        <app-ui-card
          title="Diagramas Mermaid"
          subtitle="Alterne entre fonte e visualização usando o artefato Mermaid do projeto quando existir."
        >
          <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            <app-ui-button [variant]="mode() === 'render' ? 'primary' : 'secondary'" (clicked)="mode.set('render')">
              Visualização
            </app-ui-button>
            <app-ui-button [variant]="mode() === 'source' ? 'primary' : 'secondary'" (clicked)="mode.set('source')">
              Fonte
            </app-ui-button>
            <app-ui-button variant="ghost" type="button" (clicked)="loadGenerated()">Carregar gerado</app-ui-button>
            <app-ui-button variant="ghost" type="button" (clicked)="resetSample()">Carregar exemplo</app-ui-button>
          </div>

          @if (mode() === 'source') {
            <app-ui-textarea
              label="Definição Mermaid"
              hint="Use sintaxe suportada pelo Mermaid (fluxos, sequência, classe, etc.)."
              [rows]="14"
              [value]="definition()"
              (valueChange)="source.set($event)"
            />
          } @else {
            <app-mermaid-viewer [definition]="definition()" />
          }
        </app-ui-card>
      </div>
    }
  `,
})
export class DiagramsPage {
  protected readonly projects = inject(ProjectContextService);

  protected readonly mode = signal<'render' | 'source'>('render');
  protected readonly source = signal('');
  protected readonly generatedDiagram = computed(() =>
    this.projects
      .artifactsForActiveProject()
      .find((artifact) => artifact.type === 'diagram_mermaid'),
  );
  protected readonly definition = computed(
    () => this.source() || this.generatedDiagram()?.content || SAMPLE_CONTEXT,
  );

  protected loadGenerated(): void {
    this.source.set(this.generatedDiagram()?.content || '');
  }

  protected resetSample(): void {
    this.source.set(SAMPLE_CONTEXT);
  }
}
