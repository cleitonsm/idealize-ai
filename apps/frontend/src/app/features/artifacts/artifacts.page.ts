import { Component, inject } from '@angular/core';

import type { ArtifactType } from '@idealize-ai/contracts';

import { ProjectContextService } from '../../core/services/project-context.service';
import { artifactTypeLabel } from '../../core/stage-labels';
import { ArtifactPanelComponent } from '../../shared/ui/artifact-panel.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';

@Component({
  selector: 'app-artifacts-page',
  imports: [UiCardComponent, ArtifactPanelComponent, EmptyStateComponent, UiButtonComponent],
  template: `
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">Biblioteca de artefatos</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Documentos gerados com contexto e rastreabilidade.
        </h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Revise os rascunhos do projeto ativo antes de transformar os insumos em especificação final.
        </p>
      </div>
      <app-ui-card
        title="Artefatos do projeto"
        subtitle="Documentos gerados e metadados de rastreabilidade vindos da API."
      >
        @if (!projects.activeProject()) {
          <app-empty-state
            title="Nenhum projeto ativo"
            description="Selecione um projeto na área Projetos para listar artefatos."
          />
        } @else if (projects.artifactsForActiveProject().length === 0) {
          <app-empty-state
            title="Ainda não há artefatos"
            description="Avance no fluxo guiado ou gere o primeiro documento com o backend."
          />
        } @else {
          <ul class="grid gap-4 lg:grid-cols-2" role="list">
            @for (artifact of projects.artifactsForActiveProject(); track artifact.id) {
              <li>
                <app-artifact-panel [artifact]="artifact" />
              </li>
            }
          </ul>
        }
      </app-ui-card>
      @if (projects.activeProject()) {
        <app-ui-card title="Gerar artefato" subtitle="Solicita ao backend um documento para a etapa atual.">
          <div class="flex flex-wrap gap-2">
            @for (type of artifactTypes; track type) {
              <app-ui-button
                type="button"
                variant="secondary"
                (clicked)="generate(type)"
                [disabled]="projects.loading()"
              >
                {{ artifactTypeLabel(type) }}
              </app-ui-button>
            }
          </div>
        </app-ui-card>
      }
    </div>
  `,
})
export class ArtifactsPage {
  protected readonly projects = inject(ProjectContextService);
  protected readonly artifactTypeLabel = artifactTypeLabel;
  protected readonly artifactTypes: ArtifactType[] = [
    'problem_solution',
    'value_proposition',
    'epic',
    'user_story',
    'acceptance_criteria',
    'market_analysis',
    'business_model',
    'diagram_mermaid',
  ];

  protected generate(type: ArtifactType): void {
    this.projects.generateArtifact(type);
  }
}
