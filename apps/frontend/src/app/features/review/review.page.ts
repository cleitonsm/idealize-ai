import { Component, inject } from '@angular/core';

import { ProjectContextService } from '../../core/services/project-context.service';
import { artifactTypeLabel, stageLabel } from '../../core/stage-labels';
import { ArtifactPanelComponent } from '../../shared/ui/artifact-panel.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

@Component({
  selector: 'app-review-page',
  imports: [ArtifactPanelComponent, EmptyStateComponent],
  template: `
    <section class="mx-auto max-w-5xl">
      <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div class="border-b border-slate-200 px-6 py-8 sm:px-8">
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">Revisão final</p>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Revisão</h2>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Consolidação e revisão humana dos artefatos reais antes de levar a especificação adiante.
          </p>
        </div>
        @if (projects.activeProject(); as project) {
          <div class="border-b border-slate-200 px-6 py-5 sm:px-8">
            <p class="text-sm font-semibold text-slate-950">{{ project.name }}</p>
            <p class="mt-1 text-sm text-slate-500">
              Etapa atual: {{ stageLabel(project.currentStage) }} ·
              {{ projects.artifactsForActiveProject().length }} artefato(s)
            </p>
          </div>
        }
        <div class="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-sm font-semibold text-slate-950">1. Verificar evidências</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">Confirme se cada artefato referencia o contexto correto.</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-sm font-semibold text-slate-950">2. Ajustar linguagem</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">Transforme rascunhos em decisões claras para o time.</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-sm font-semibold text-slate-950">3. Aprovar saída</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">Marque lacunas antes de compartilhar a documentação.</p>
          </div>
        </div>
        <div class="border-t border-slate-200 p-6 sm:p-8">
          @if (!projects.activeProject()) {
            <app-empty-state
              title="Nenhum projeto ativo"
              description="Selecione um projeto para revisar os artefatos gerados."
            />
          } @else if (projects.artifactsForActiveProject().length === 0) {
            <app-empty-state
              title="Sem artefatos para revisar"
              description="Gere documentos na biblioteca de artefatos antes da revisão final."
            />
          } @else {
            <div class="grid gap-4 lg:grid-cols-2">
              @for (artifact of projects.artifactsForActiveProject(); track artifact.id) {
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {{ artifactTypeLabel(artifact.type) }}
                  </p>
                  <app-artifact-panel [artifact]="artifact" />
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ReviewPage {
  protected readonly projects = inject(ProjectContextService);
  protected readonly artifactTypeLabel = artifactTypeLabel;
  protected readonly stageLabel = stageLabel;
}
