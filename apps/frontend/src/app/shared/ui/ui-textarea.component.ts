import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-ui-textarea',
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium leading-6 text-slate-900" [attr.for]="fieldId">{{ label() }}</label>
      }
      <textarea
        [id]="fieldId"
        class="block min-h-[120px] w-full resize-y rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 transition focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        [attr.rows]="rows()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
      ></textarea>
      @if (hint()) {
        <p class="text-xs leading-5 text-slate-500">{{ hint() }}</p>
      }
    </div>
  `,
})
export class UiTextareaComponent {
  protected readonly fieldId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `ui-ta-${crypto.randomUUID().slice(0, 8)}`
      : `ui-ta-${Math.random().toString(36).slice(2, 10)}`;

  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input(false);
  readonly rows = input<number>(5);

  readonly value = model<string>('');
}
