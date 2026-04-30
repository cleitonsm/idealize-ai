import { Component, inject } from '@angular/core';

import { ProjectContextService } from '../../core/services/project-context.service';
import { ArtifactPanelComponent } from '../../shared/ui/artifact-panel.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';

@Component({
  selector: 'app-artifacts-page',
  imports: [UiCardComponent, ArtifactPanelComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-4xl space-y-6">
      <app-ui-card
        title="Artefatos do projeto"
        subtitle="Documentos gerados e metadados de rastreabilidade — dados mock até a API estar disponível."
      >
        @if (!projects.activeProject()) {
          <app-empty-state
            title="Nenhum projeto ativo"
            description="Selecione um projeto na área Projetos para listar artefatos."
          />
        } @else if (projects.artifactsForActiveProject().length === 0) {
          <app-empty-state
            title="Ainda não há artefatos"
            description="Avance no fluxo guiado ou gere documentos quando o backend estiver conectado."
          />
        } @else {
          <ul class="flex flex-col gap-4" role="list">
            @for (artifact of projects.artifactsForActiveProject(); track artifact.id) {
              <li>
                <app-artifact-panel [artifact]="artifact" />
              </li>
            }
          </ul>
        }
      </app-ui-card>
    </div>
  `,
})
export class ArtifactsPage {
  protected readonly projects = inject(ProjectContextService);
}
