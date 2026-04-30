import { Component } from '@angular/core';
import type { Stage } from '@idealize-ai/contracts';

@Component({
  selector: 'app-projects-page',
  template: `
    <section class="mx-auto max-w-3xl">
      <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Projetos</h2>
        <p class="mt-2 text-sm text-slate-600">
          Crie e gerencie projetos. Esta área será conectada à API na próxima fase.
        </p>
      </div>
    </section>
  `,
})
export class ProjectsPage {
  /** Ensures the contracts package is wired; replaced by real data later. */
  readonly initialStage: Stage = 'initial_idea';
}
