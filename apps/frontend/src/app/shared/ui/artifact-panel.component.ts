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
      class="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:border-primary-200 hover:shadow-md"
    >
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold text-slate-900">{{ artifact().title }}</h3>
          <p class="mt-0.5 text-xs text-slate-500">
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
      <p class="line-clamp-4 whitespace-pre-wrap text-sm text-slate-700">{{ artifact().content }}</p>
      @if (artifact().sourceContext) {
        <div class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-100">
          <span class="font-medium text-slate-700">Contexto / evidência:</span>
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
