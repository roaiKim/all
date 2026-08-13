import type {
  GameProject,
  GameState,
  Scene,
  Choice,
  Condition,
  Effect,
  VariableValue,
  SaveData,
} from '@shared/types/game';

type Listener = (state: GameState) => void;

/**
 * Core game engine — manages scene flow, variable state, and save/load.
 *
 * Architecture:
 * - Pure state machine (no DOM / framework dependency)
 * - Immutable state updates via listeners
 * - Condition evaluation & effect application at scene transitions
 */
export class GameEngine {
  private project: GameProject;
  private state: GameState;
  private listeners: Set<Listener> = new Set();
  private saves: Map<number, SaveData> = new Map();

  constructor(project: GameProject) {
    this.project = project;
    this.state = {
      currentSceneId: '',
      variables: this.initVariables(),
      history: [],
      isPlaying: false,
      isPaused: false,
    };
    // Load saves from localStorage
    this.loadSavesFromStorage();
  }

  // ---- Public API ----

  /** Start (or restart) the game from the first scene */
  start(): void {
    this.state = {
      currentSceneId: this.project.meta.firstSceneId,
      variables: this.initVariables(),
      history: [],
      isPlaying: true,
      isPaused: false,
    };
    this.emit();
  }

  /** Advance to next scene (linear path, or end if no next) */
  advance(): void {
    if (!this.state.isPlaying || this.state.isPaused) return;

    const scene = this.getCurrentScene();
    if (!scene) return;

    // If scene has choices, don't auto-advance
    if (scene.choices && scene.choices.length > 0) return;

    // If there's a linear next scene, go there
    if (scene.nextSceneId) {
      this.transitionTo(scene.nextSceneId);
    } else {
      // No next scene — stop playing
      this.state.isPlaying = false;
      this.emit();
    }
  }

  /** Handle player selecting a choice */
  selectChoice(choiceId: string): void {
    const scene = this.getCurrentScene();
    if (!scene?.choices) return;

    const choice = scene.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply choice effects
    if (choice.effects) {
      this.applyEffects(choice.effects);
    }

    // Transition to target scene
    if (choice.nextSceneId) {
      this.transitionTo(choice.nextSceneId);
    }
  }

  /** Get current scene object */
  getCurrentScene(): Scene | undefined {
    return this.project.scenes.find((s) => s.id === this.state.currentSceneId);
  }

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Create a save data snapshot */
  createSaveData(slotIndex: number, label: string): SaveData {
    return {
      id: `save_${slotIndex}_${Date.now()}`,
      slotIndex,
      timestamp: new Date().toISOString(),
      currentSceneId: this.state.currentSceneId,
      variables: { ...this.state.variables },
      label,
    };
  }

  /** Restore from save data */
  loadFromSave(save: SaveData): void {
    this.state.currentSceneId = save.currentSceneId;
    this.state.variables = { ...save.variables };
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.emit();
  }

  /** Persist a save to in-memory cache + localStorage */
  persistSave(save: SaveData): void {
    this.saves.set(save.slotIndex, save);
    try {
      localStorage.setItem(`gal_save_${save.slotIndex}`, JSON.stringify(save));
    } catch {
      // Storage full or unavailable
    }
  }

  /** Get all save slots */
  getAllSaves(): SaveData[] {
    return Array.from(this.saves.values()).sort((a, b) => a.slotIndex - b.slotIndex);
  }

  /** Pause / resume */
  togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
    this.emit();
  }

  /**
   * Hot-reload project data (for editor live preview).
   * Preserves the current scene and variable values where possible,
   * so editing a scene refreshes the preview without losing progress.
   */
  reloadProject(project: GameProject): void {
    this.project = project;

    // Merge variables: keep existing values, apply defaults for new vars
    const newVars = this.initVariables();
    for (const [id, val] of Object.entries(this.state.variables)) {
      if (id in newVars) newVars[id] = val;
    }
    this.state.variables = newVars;

    // If the current scene was deleted, fall back to the first scene
    if (!this.project.scenes.some((s) => s.id === this.state.currentSceneId)) {
      this.state.currentSceneId = this.project.meta.firstSceneId;
    }

    this.emit();
  }

  /** Jump to a specific scene (for "preview from current scene") */
  jumpTo(sceneId: string): void {
    if (!this.project.scenes.some((s) => s.id === sceneId)) return;
    this.state.currentSceneId = sceneId;
    this.state.history = [];
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.emit();
  }

  /** Cleanup */
  destroy(): void {
    this.listeners.clear();
  }

  // ---- Internal ----

  private initVariables(): Record<string, VariableValue> {
    const vars: Record<string, VariableValue> = {};
    for (const v of this.project.variables) {
      vars[v.id] = v.defaultValue;
    }
    return vars;
  }

  private transitionTo(sceneId: string): void {
    const targetScene = this.project.scenes.find((s) => s.id === sceneId);
    if (!targetScene) {
      console.warn(`Scene "${sceneId}" not found`);
      return;
    }

    // Check conditions
    if (targetScene.conditions && !this.evaluateConditions(targetScene.conditions)) {
      console.warn(`Conditions not met for scene "${sceneId}", skipping`);
      // Try next scene if linear
      if (targetScene.nextSceneId) {
        this.transitionTo(targetScene.nextSceneId);
      }
      return;
    }

    // Update state
    this.state.history.push(this.state.currentSceneId);
    this.state.currentSceneId = sceneId;

    // Apply effects
    if (targetScene.effects) {
      this.applyEffects(targetScene.effects);
    }

    // If ending scene, stop playing
    if (targetScene.type === 'ending') {
      this.state.isPlaying = false;
    }

    this.emit();
  }

  private evaluateConditions(conditions: Condition[]): boolean {
    return conditions.every((cond) => {
      const current = this.state.variables[cond.variableId];
      if (current === undefined) return false;

      switch (cond.operator) {
        case 'eq':
          return current === cond.value;
        case 'neq':
          return current !== cond.value;
        case 'gt':
          return Number(current) > Number(cond.value);
        case 'gte':
          return Number(current) >= Number(cond.value);
        case 'lt':
          return Number(current) < Number(cond.value);
        case 'lte':
          return Number(current) <= Number(cond.value);
        default:
          return false;
      }
    });
  }

  private applyEffects(effects: Effect[]): void {
    for (const effect of effects) {
      const current = this.state.variables[effect.variableId];
      switch (effect.action) {
        case 'set':
          this.state.variables[effect.variableId] = effect.value;
          break;
        case 'add':
          this.state.variables[effect.variableId] = Number(current ?? 0) + Number(effect.value);
          break;
        case 'toggle':
          this.state.variables[effect.variableId] = !current;
          break;
      }
    }
  }

  private emit(): void {
    const snapshot = { ...this.state };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  private loadSavesFromStorage(): void {
    for (let i = 0; i < 10; i++) {
      try {
        const raw = localStorage.getItem(`gal_save_${i}`);
        if (raw) {
          const save = JSON.parse(raw) as SaveData;
          this.saves.set(i, save);
        }
      } catch {
        // Ignore corrupted saves
      }
    }
  }
}
