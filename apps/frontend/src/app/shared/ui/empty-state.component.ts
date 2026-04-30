import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-slate-50/80 px-6 py-10 text-center"
    >
      <p class="text-sm font-medium text-slate-900">{{ title() }}</p>
      @if (description()) {
        <p class="max-w-md text-sm text-slate-600">{{ description() }}</p>
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
