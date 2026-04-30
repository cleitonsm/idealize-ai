import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Artifact, ArtifactType, Message, Project, Stage } from '@idealize-ai/contracts';
import { Observable } from 'rxjs';

import { environment } from '../config/environment';

export interface RegisterIdeaResponse {
  project: Project;
  message: Message;
}

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/projects`;

  listProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  createProject(name: string, description?: string): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, { name, description });
  }

  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${projectId}`);
  }

  registerIdea(projectId: string, content: string): Observable<RegisterIdeaResponse> {
    return this.http.post<RegisterIdeaResponse>(`${this.baseUrl}/${projectId}/idea`, { content });
  }

  advanceProject(projectId: string, targetStage?: Stage): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/${projectId}/advance`, {
      targetStage,
    });
  }

  listArtifacts(projectId: string): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(`${this.baseUrl}/${projectId}/artifacts`);
  }

  generateArtifact(
    projectId: string,
    type: ArtifactType,
    title?: string,
  ): Observable<Artifact> {
    return this.http.post<Artifact>(`${this.baseUrl}/${projectId}/artifacts`, { type, title });
  }

  listHistory(projectId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${projectId}/history`);
  }
}
