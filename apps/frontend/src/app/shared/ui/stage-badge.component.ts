import { Component, computed, input } from '@angular/core';

import type { Stage } from '@idealize-ai/contracts';

import { stageLabel as labelForStage } from '../../core/stage-labels';

@Component({
  selector: 'app-stage-badge',
  template: `
    <span [class]="badgeClasses()" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset">
      {{ displayLabel() }}
    </span>
  `,
})
export class StageBadgeComponent {
  readonly stage = input.required<Stage>();

  readonly displayLabel = computed(() => labelForStage(this.stage()));

  readonly badgeClasses = computed(() => {
    const s = this.stage();
    const map: Record<Stage, string> = {
      initial_idea: 'bg-slate-50 text-slate-800',
      interview: 'bg-sky-50 text-sky-900',
      brainstorming: 'bg-violet-50 text-violet-900',
      requirements: 'bg-amber-50 text-amber-900',
      business_case: 'bg-indigo-50 text-indigo-900',
      stack_modeling: 'bg-cyan-50 text-cyan-900',
      modeling: 'bg-teal-50 text-teal-900',
      review: 'bg-emerald-50 text-emerald-900',
    };
    return map[s];
  });
}
