import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ProjectContextService } from '../services/project-context.service';
import { StageBadgeComponent } from '../../shared/ui/stage-badge.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, StageBadgeComponent],
  template: `
    <div class="min-h-screen bg-slate-950">
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div class="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
      </div>
      <div class="relative flex min-h-screen">
      <aside
        class="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/95 md:flex md:flex-col"
        aria-label="Navegação principal"
      >
        <div class="border-b border-white/10 px-6 py-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/25">
              IA
            </div>
            <div>
              <div class="text-sm font-semibold text-white">Idealize AI</div>
              <div class="text-xs text-slate-400">Discovery operacional</div>
            </div>
          </div>
        </div>
        <nav class="flex flex-1 flex-col gap-1.5 p-4" role="navigation">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-white/10 text-white ring-1 ring-white/10"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-semibold text-slate-300 ring-1 ring-white/10 group-hover:text-white">
                {{ item.initial }}
              </span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="m-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p class="text-xs font-medium uppercase tracking-wide text-primary-200">MVP local</p>
          <p class="mt-2 text-sm text-slate-300">
            Use a jornada guiada para gerar insumos e revisar artefatos com rastreabilidade.
          </p>
        </div>
      </aside>
      <div class="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <header
          class="border-b border-white/10 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-8"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">
                Workspace de produto
              </p>
              <h1 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                {{ projectContext.activeProject()?.name ?? 'Nenhum projeto ativo' }}
              </h1>
              <p class="mt-1 text-sm text-slate-500">
                Fluxo guiado, artefatos e diagramas para revisão humana.
              </p>
            </div>
            @if (projectContext.activeProject(); as project) {
              <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                <app-stage-badge [stage]="project.currentStage" />
              </div>
            }
          </div>
        </header>
        <main class="flex-1 overflow-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
      <nav
        class="fixed bottom-0 left-0 right-0 z-10 flex border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur md:hidden"
        aria-label="Navegação móvel"
      >
        @for (item of nav; track item.path) {
          <a
            class="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center text-[11px] font-medium text-slate-300"
            [routerLink]="item.path"
            routerLinkActive="bg-white/10 text-white"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          >
            <span class="truncate">{{ item.short }}</span>
          </a>
        }
      </nav>
      </div>
    </div>
  `,
})
export class AppShellComponent {
  protected readonly projectContext = inject(ProjectContextService);

  readonly nav: {
    path: string;
    label: string;
    short: string;
    initial: string;
    exact?: boolean;
  }[] = [
    { path: '/projects', label: 'Projetos', short: 'Projetos', initial: 'P', exact: true },
    { path: '/guided-discovery', label: 'Descoberta guiada', short: 'Discovery', initial: 'D' },
    { path: '/artifacts', label: 'Artefatos', short: 'Docs', initial: 'A' },
    { path: '/diagrams', label: 'Diagramas', short: 'Diagramas', initial: 'M' },
    { path: '/review', label: 'Revisão', short: 'Revisão', initial: 'R' },
  ];
}
