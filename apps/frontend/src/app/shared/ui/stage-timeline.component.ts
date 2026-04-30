import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import type { Stage } from '@idealize-ai/contracts';

import { STAGE_ORDER, stageIndex, stageLabel } from '../../core/stage-labels';

@Component({
  selector: 'app-stage-timeline',
  imports: [NgClass],
  template: `
    <div
      class="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible"
      role="list"
      aria-label="Etapas do fluxo guiado"
    >
      @for (stage of STAGE_ORDER; track stage; let i = $index) {
        <div
          class="flex min-w-[168px] flex-1 flex-col rounded-2xl px-4 py-4 shadow-sm ring-1 transition"
          [ngClass]="{
            'bg-primary-50 ring-primary-200': isCurrent(stage),
            'bg-white ring-slate-200': !isCurrent(stage),
          }"
          role="listitem"
        >
          <div class="flex items-start gap-2">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              [class]="dotClasses(stage)"
            >
              {{ i + 1 }}
            </span>
            <p class="text-sm font-semibold leading-snug text-slate-900">{{ label(stage) }}</p>
          </div>
          @if (isCurrent(stage)) {
            <p class="mt-3 text-xs font-semibold text-primary-800">Etapa atual</p>
          } @else if (isDone(stage)) {
            <p class="mt-3 text-xs font-medium text-emerald-700">Concluída</p>
          } @else {
            <p class="mt-3 text-xs font-medium text-slate-500">Pendente</p>
          }
        </div>
      }
    </div>
  `,
})
export class StageTimelineComponent {
  readonly currentStage = input.required<Stage>();

  protected readonly STAGE_ORDER = STAGE_ORDER;

  private readonly currentIndex = computed(() => stageIndex(this.currentStage()));

  protected isCurrent(stage: Stage): boolean {
    return stage === this.currentStage();
  }

  protected isDone(stage: Stage): boolean {
    const idx = stageIndex(stage);
    const cur = this.currentIndex();
    return idx >= 0 && cur >= 0 && idx < cur;
  }

  protected label(stage: Stage): string {
    return stageLabel(stage);
  }

  protected dotClasses(stage: Stage): string {
    if (this.isCurrent(stage)) {
      return 'bg-primary-600 text-white';
    }
    if (this.isDone(stage)) {
      return 'bg-emerald-600 text-white';
    }
    return 'bg-slate-200 text-slate-600';
  }
}
