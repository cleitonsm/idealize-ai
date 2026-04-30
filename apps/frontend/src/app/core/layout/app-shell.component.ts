import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-surface">
      <aside
        class="hidden w-56 shrink-0 border-r border-border bg-white md:flex md:flex-col"
        aria-label="Etapas"
      >
        <div class="border-b border-border px-4 py-4">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Idealize AI</div>
          <div class="mt-1 text-sm font-semibold text-slate-900">Discovery</div>
        </div>
        <nav class="flex flex-1 flex-col gap-1 p-3">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-primary-50 text-primary-800 border-primary-200"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="rounded-lg border border-transparent px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>
      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:px-6"
        >
          <div>
            <h1 class="text-base font-semibold text-slate-900">Projeto</h1>
            <p class="text-sm text-slate-500">Fluxo guiado de descoberta e artefatos</p>
          </div>
        </header>
        <main class="flex-1 overflow-auto bg-surface-muted p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppShellComponent {
  readonly nav: { path: string; label: string; exact?: boolean }[] = [
    { path: '/projects', label: 'Projetos', exact: true },
    { path: '/guided-discovery', label: 'Descoberta guiada' },
    { path: '/artifacts', label: 'Artefatos' },
    { path: '/diagrams', label: 'Diagramas' },
    { path: '/review', label: 'Revisão' },
  ];
}
