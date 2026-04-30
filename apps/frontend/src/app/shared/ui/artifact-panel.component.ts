import { Component, computed, input } from '@angular/core';

import type { Artifact } from '@idealize-ai/contracts';

import {
  artifactStatusClasses,
  artifactStatusLabel,
  artifactTypeLabel,
  stageLabel,
} from '../../core/stage-labels';

@Component({
  selector: 'app-artifact-panel',
  template: `
    <article
      class="group flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary-200"
    >
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold leading-6 text-slate-950 group-hover:text-primary-700">{{ artifact().title }}</h3>
          <p class="mt-0.5 text-xs font-medium text-slate-500">
            {{ typeLabel() }} · {{ stageLabelText() }}
          </p>
        </div>
        <span
          class="inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
          [class]="statusClasses()"
        >
          {{ statusLabel() }}
        </span>
      </div>
      <p class="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ artifact().content }}</p>
      @if (artifact().sourceContext) {
        <div class="rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">
          <span class="font-semibold text-slate-800">Contexto / evidência:</span>
          {{ artifact().sourceContext }}
        </div>
      }
    </article>
  `,
})
export class ArtifactPanelComponent {
  readonly artifact = input.required<Artifact>();

  protected readonly typeLabel = computed(() => artifactTypeLabel(this.artifact().type));
  protected readonly stageLabelText = computed(() => stageLabel(this.artifact().stage));
  protected readonly statusLabel = computed(() => artifactStatusLabel(this.artifact().status));
  protected readonly statusClasses = computed(() => artifactStatusClasses(this.artifact().status));
}
