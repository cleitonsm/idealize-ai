import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
    >
      <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
        +
      </div>
      <p class="text-sm font-semibold text-slate-950">{{ title() }}</p>
      @if (description()) {
        <p class="max-w-md text-sm leading-6 text-slate-500">{{ description() }}</p>
      }
      <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
