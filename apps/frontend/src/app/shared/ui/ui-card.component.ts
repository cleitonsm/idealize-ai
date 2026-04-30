import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  template: `
    <section
      class="rounded-xl border border-border bg-white shadow-sm"
      [class]="paddingClass()"
    >
      @if (title() || subtitle()) {
        <header class="border-b border-border px-5 py-4">
          @if (title()) {
            <h2 class="text-base font-semibold text-slate-900">{{ title() }}</h2>
          }
          @if (subtitle()) {
            <p class="mt-1 text-sm text-slate-600">{{ subtitle() }}</p>
          }
        </header>
      }
      <div [class]="bodyPaddingClass()">
        <ng-content />
      </div>
    </section>
  `,
})
export class UiCardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  /** When false, header slot is omitted but body still padded. */
  readonly padded = input(true);

  readonly paddingClass = input('overflow-hidden');
  readonly bodyPaddingClass = input('px-5 py-5');
}
