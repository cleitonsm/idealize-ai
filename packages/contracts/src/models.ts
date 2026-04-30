import type {
  ArtifactStatus,
  ArtifactType,
  MessageRole,
  Stage,
} from './enums';

export interface Project {
  id: string;
  name: string;
  description?: string;
  currentStage: Stage;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  projectId: string;
  role: MessageRole;
  content: string;
  stage?: Stage;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface Artifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  title: string;
  content: string;
  stage: Stage;
  status: ArtifactStatus;
  sourceContext?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AcceptanceCriteria {
  id: string;
  description: string;
  satisfied?: boolean;
}

export interface UserStory {
  id: string;
  title: string;
  narrative: string;
  epicId?: string;
  acceptanceCriteria: AcceptanceCriteria[];
  metadata?: Record<string, unknown>;
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  userStories: UserStory[];
  metadata?: Record<string, unknown>;
}
