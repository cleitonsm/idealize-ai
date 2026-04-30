import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projects' },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.page').then((m) => m.ProjectsPage),
      },
      {
        path: 'guided-discovery',
        loadComponent: () =>
          import('./features/guided-discovery/guided-discovery.page').then(
            (m) => m.GuidedDiscoveryPage,
          ),
      },
      {
        path: 'artifacts',
        loadComponent: () =>
          import('./features/artifacts/artifacts.page').then((m) => m.ArtifactsPage),
      },
      {
        path: 'diagrams',
        loadComponent: () =>
          import('./features/diagrams/diagrams.page').then((m) => m.DiagramsPage),
      },
      {
        path: 'review',
        loadComponent: () =>
          import('./features/review/review.page').then((m) => m.ReviewPage),
      },
    ],
  },
];
