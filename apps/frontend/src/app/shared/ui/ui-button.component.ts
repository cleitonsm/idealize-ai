import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
})
export class UiButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly clicked = output<MouseEvent>();

  readonly buttonClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    switch (this.variant()) {
      case 'primary':
        return `${base} bg-primary-600 text-white hover:bg-primary-700`;
      case 'secondary':
        return `${base} border border-border bg-white text-slate-900 shadow-sm hover:bg-slate-50`;
      default:
        return `${base} text-primary-800 hover:bg-primary-50`;
    }
  });
}
