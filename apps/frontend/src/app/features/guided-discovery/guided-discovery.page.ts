import { Component, inject, signal } from '@angular/core';

import type { Stage } from '@idealize-ai/contracts';

import { STAGE_ORDER, stageLabel } from '../../core/stage-labels';
import { ProjectContextService } from '../../core/services/project-context.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { StageBadgeComponent } from '../../shared/ui/stage-badge.component';
import { StageTimelineComponent } from '../../shared/ui/stage-timeline.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiTextareaComponent } from '../../shared/ui/ui-textarea.component';

@Component({
  selector: 'app-guided-discovery-page',
  imports: [
    UiCardComponent,
    UiTextareaComponent,
    UiButtonComponent,
    StageTimelineComponent,
    StageBadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    @if (projects.activeProject(); as project) {
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <app-ui-card
          title="Progresso"
          subtitle="Etapas previstas no MVP — estado sincronizado com o projeto ativo (mock)."
        >
          <app-stage-timeline [currentStage]="project.currentStage" />
        </app-ui-card>

        <div class="grid gap-6 lg:grid-cols-5">
          <app-ui-card
            class="lg:col-span-2"
            title="Ideia inicial"
            subtitle="Capture o contexto em texto livre; na integração com a API isto alimentará o grafo."
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Etapa</span>
                <app-stage-badge [stage]="project.currentStage" />
              </div>
              <app-ui-textarea
                label="Descrição da ideia"
                placeholder="Qual problema você quer resolver? Para quem?"
                [rows]="8"
                [value]="ideaDraft()"
                (valueChange)="ideaDraft.set($event)"
              />
              <app-ui-button variant="secondary" type="button" (clicked)="stashIdea()">
                Guardar rascunho localmente
              </app-ui-button>
            </div>
          </app-ui-card>

          <app-ui-card
            class="lg:col-span-3"
            title="Conversa por etapa"
            subtitle="Histórico simulado — substituído por mensagens reais ao conectar o backend."
          >
            <div class="flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-lg bg-slate-50/80 p-3 ring-1 ring-slate-100">
              @for (m of chatPreview(); track m.id) {
                <div
                  class="flex flex-col gap-1 rounded-lg px-3 py-2 text-sm shadow-sm"
                  [class.ml-8]="m.role === 'assistant'"
                  [class.mr-8]="m.role === 'user'"
                  [class.bg-white]="m.role === 'assistant'"
                  [class.bg-primary-600]="m.role === 'user'"
                  [class.text-slate-800]="m.role === 'assistant'"
                  [class.text-white]="m.role === 'user'"
                >
                  <span class="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    {{ m.role === 'user' ? 'Você' : 'Assistente' }} · {{ stageLabel(m.stage) }}
                  </span>
                  <p class="whitespace-pre-wrap">{{ m.text }}</p>
                </div>
              }
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <app-ui-textarea
                label="Próxima mensagem (simulação)"
                placeholder="Experimente enviar uma resposta — apenas UI por enquanto."
                [rows]="3"
                [value]="composer()"
                (valueChange)="composer.set($event)"
              />
              <app-ui-button type="button" (clicked)="sendSimulated()">Enviar</app-ui-button>
            </div>
          </app-ui-card>
        </div>

        <app-ui-card title="Avançar etapa (demonstração)" subtitle="Atualiza o estágio do projeto ativo.">
          <div class="flex flex-wrap gap-2">
            @for (s of STAGE_ORDER; track s) {
              <app-ui-button variant="ghost" type="button" (clicked)="goToStage(s)">
                {{ stageLabel(s) }}
              </app-ui-button>
            }
          </div>
        </app-ui-card>
      </div>
    } @else {
      <app-empty-state
        title="Selecione um projeto"
        description="Abra a área de Projetos e escolha ou crie um projeto para seguir a descoberta guiada."
      />
    }
  `,
})
export class GuidedDiscoveryPage {
  protected readonly projects = inject(ProjectContextService);

  protected readonly STAGE_ORDER = STAGE_ORDER;
  protected readonly stageLabel = stageLabel;

  protected readonly ideaDraft = signal('');
  protected readonly composer = signal('');

  protected readonly chatPreview = signal<
    { id: string; role: 'user' | 'assistant'; stage: Stage; text: string }[]
  >([
    {
      id: '1',
      role: 'assistant',
      stage: 'initial_idea',
      text: 'Vamos clarificar a ideia: qual dor você observa hoje e quem sofre com ela?',
    },
  ]);

  protected stashIdea(): void {
    // Placeholder: future persistence via API
    this.ideaDraft.update((t) => t);
  }

  protected sendSimulated(): void {
    const text = this.composer().trim();
    if (!text) {
      return;
    }
    const active = this.projects.activeProject();
    if (!active) {
      return;
    }
    const stage = active.currentStage;
    this.chatPreview.update((rows) => [
      ...rows,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
        role: 'user',
        stage,
        text,
      },
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        stage,
        text: 'Entendido. Quando a API estiver ligada, isto seguirá para entrevista e brainstorming.',
      },
    ]);
    this.composer.set('');
  }

  protected goToStage(stage: Stage): void {
    this.projects.setStageForActiveProject(stage);
  }
}
