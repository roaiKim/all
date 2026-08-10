import type { GameProject, Scene } from '@shared/types/game';

/**
 * ScriptParser — reads and validates a GameProject JSON,
 * provides scene lookup and variable resolution utilities.
 *
 * In production, this also handles loading external .gal script bundles.
 */
export class ScriptParser {
  private project: GameProject;
  private sceneMap: Map<string, Scene> = new Map();

  constructor(project: GameProject) {
    this.project = project;
    this.buildIndex();
  }

  /** Get a scene by ID */
  getScene(id: string): Scene | undefined {
    return this.sceneMap.get(id);
  }

  /** Get the entry scene */
  getFirstScene(): Scene | undefined {
    return this.sceneMap.get(this.project.meta.firstSceneId);
  }

  /** Get all scene IDs */
  getAllSceneIds(): string[] {
    return Array.from(this.sceneMap.keys());
  }

  /** Get scene count */
  getSceneCount(): number {
    return this.sceneMap.size;
  }

  /** Get the raw project data */
  getProject(): GameProject {
    return this.project;
  }

  /** Replace project data (e.g. hot-reload in preview mode) */
  reload(project: GameProject): void {
    this.project = project;
    this.buildIndex();
  }

  // ---- Internal ----

  private buildIndex(): void {
    this.sceneMap.clear();
    for (const scene of this.project.scenes) {
      this.sceneMap.set(scene.id, scene);
    }
  }
}
