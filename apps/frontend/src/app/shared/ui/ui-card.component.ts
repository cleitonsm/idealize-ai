import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  template: `
    <section
      class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md"
      [class]="paddingClass()"
    >
      @if (title() || subtitle()) {
        <header class="border-b border-slate-200 px-6 py-5">
          @if (title()) {
            <h2 class="text-base font-semibold leading-7 text-slate-950">{{ title() }}</h2>
          }
          @if (subtitle()) {
            <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{{ subtitle() }}</p>
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
  readonly bodyPaddingClass = input('px-6 py-6');
}
