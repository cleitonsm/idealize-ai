import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-ui-textarea',
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium text-slate-700" [attr.for]="fieldId">{{ label() }}</label>
      }
      <textarea
        [id]="fieldId"
        class="min-h-[120px] w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        [attr.rows]="rows()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
      ></textarea>
      @if (hint()) {
        <p class="text-xs text-slate-500">{{ hint() }}</p>
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
