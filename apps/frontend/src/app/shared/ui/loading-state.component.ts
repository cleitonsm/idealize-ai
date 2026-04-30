import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/90 px-6 py-12 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <span
        class="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"
        aria-hidden="true"
      ></span>
      <p class="text-sm text-slate-600">{{ message() }}</p>
    </div>
  `,
})
export class LoadingStateComponent {
  readonly message = input<string>('Carregando…');
}
