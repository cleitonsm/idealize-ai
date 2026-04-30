import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mermaid-viewer',
  template: `
    <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      @if (svgHtml(); as safe) {
        <div
          class="mermaid-host min-h-[80px] overflow-x-auto p-6"
          [innerHTML]="safe"
        ></div>
      } @else {
        <div class="p-8 text-center text-sm text-slate-500" aria-busy="true">Gerando diagrama…</div>
      }
    </div>
  `,
})
export class MermaidViewerComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document: Document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  /** Mermaid diagram definition (without fenced code fences). */
  readonly definition = input.required<string>();

  protected readonly svgHtml = signal<SafeHtml | null>(null);

  constructor() {
    effect(() => {
      const def = this.definition();
      void this.renderDiagram(def);
    });
  }

  private async renderDiagram(def: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!def?.trim()) {
      this.svgHtml.set(null);
      return;
    }

    this.svgHtml.set(null);

    const id = `mmd-${Math.random().toString(36).slice(2)}`;
    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'strict',
      });
      const { svg } = await mermaid.render(id, def);
      this.svgHtml.set(this.sanitizer.bypassSecurityTrustHtml(svg));
    } catch {
      const wrap = this.document.createElement('div');
      wrap.className = 'p-4 text-sm text-rose-700';
      wrap.textContent =
        'Não foi possível renderizar o diagrama. Verifique a sintaxe Mermaid.';
      this.svgHtml.set(this.sanitizer.bypassSecurityTrustHtml(wrap.outerHTML));
    }
  }
}
