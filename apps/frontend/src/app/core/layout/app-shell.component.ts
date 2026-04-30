import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ProjectContextService } from '../services/project-context.service';
import { StageBadgeComponent } from '../../shared/ui/stage-badge.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, StageBadgeComponent],
  template: `
    <div class="flex min-h-screen bg-surface">
      <aside
        class="hidden w-56 shrink-0 border-r border-border bg-white md:flex md:flex-col"
        aria-label="Navegação principal"
      >
        <div class="border-b border-border px-4 py-4">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Idealize AI</div>
          <div class="mt-1 text-sm font-semibold text-slate-900">Discovery operacional</div>
        </div>
        <nav class="flex flex-1 flex-col gap-1 p-3" role="navigation">
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
      <div class="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <header
          class="flex flex-col gap-2 border-b border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6"
        >
          <div>
            <h1 class="text-base font-semibold text-slate-900">
              {{ projectContext.activeProject()?.name ?? 'Nenhum projeto ativo' }}
            </h1>
            <p class="text-sm text-slate-500">
              Fluxo guiado, artefatos e diagramas — insumos para revisão humana.
            </p>
          </div>
          @if (projectContext.activeProject(); as project) {
            <app-stage-badge [stage]="project.currentStage" />
          }
        </header>
        <main class="flex-1 overflow-auto bg-surface-muted p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
      <nav
        class="fixed bottom-0 left-0 right-0 z-10 flex border-t border-border bg-white/95 px-2 py-2 backdrop-blur md:hidden"
        aria-label="Navegação móvel"
      >
        @for (item of nav; track item.path) {
          <a
            class="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-center text-[11px] font-medium text-slate-600"
            [routerLink]="item.path"
            routerLinkActive="bg-primary-50 text-primary-800"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          >
            <span class="truncate">{{ item.short }}</span>
          </a>
        }
      </nav>
    </div>
  `,
})
export class AppShellComponent {
  protected readonly projectContext = inject(ProjectContextService);

  readonly nav: { path: string; label: string; short: string; exact?: boolean }[] = [
    { path: '/projects', label: 'Projetos', short: 'Projetos', exact: true },
    { path: '/guided-discovery', label: 'Descoberta guiada', short: 'Discovery' },
    { path: '/artifacts', label: 'Artefatos', short: 'Docs' },
    { path: '/diagrams', label: 'Diagramas', short: 'Diagramas' },
    { path: '/review', label: 'Revisão', short: 'Revisão' },
  ];
}
