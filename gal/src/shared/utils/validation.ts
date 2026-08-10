// ============================================================
// Validation utilities for GameProject data
// ============================================================

import type { GameProject, Scene } from '../types/game';

export interface ValidationError {
  path: string; // e.g. "scenes[0].name"
  message: string;
}

/** Validate a full project and return all errors */
export function validateProject(project: GameProject): ValidationError[] {
  const errors: ValidationError[] = [];

  // Meta
  if (!project.meta.title.trim()) {
    errors.push({ path: 'meta.title', message: '项目标题不能为空' });
  }
  if (!project.meta.firstSceneId) {
    errors.push({ path: 'meta.firstSceneId', message: '请设置起始场景' });
  }

  // Scenes
  if (project.scenes.length === 0) {
    errors.push({ path: 'scenes', message: '至少需要一个场景' });
  }

  const sceneIds = new Set(project.scenes.map((s) => s.id));

  project.scenes.forEach((scene, i) => {
    const prefix = `scenes[${i}]`;

    if (!scene.name.trim()) {
      errors.push({ path: `${prefix}.name`, message: '场景名称不能为空' });
    }

    // Validate choice targets exist
    if (scene.choices) {
      scene.choices.forEach((choice, ci) => {
        if (choice.nextSceneId && !sceneIds.has(choice.nextSceneId)) {
          errors.push({
            path: `${prefix}.choices[${ci}].nextSceneId`,
            message: `跳转目标 "${choice.nextSceneId}" 不存在`,
          });
        }
      });
    }

    // Validate linear next scene
    if (scene.nextSceneId && !sceneIds.has(scene.nextSceneId)) {
      errors.push({
        path: `${prefix}.nextSceneId`,
        message: `跳转目标 "${scene.nextSceneId}" 不存在`,
      });
    }

    // Ending should not have next
    if (scene.type === 'ending' && (scene.nextSceneId || scene.choices?.length)) {
      errors.push({
        path: `${prefix}.type`,
        message: '结局场景不应有跳转或选项',
      });
    }
  });

  // Validate first scene exists
  if (project.meta.firstSceneId && !sceneIds.has(project.meta.firstSceneId)) {
    errors.push({
      path: 'meta.firstSceneId',
      message: `起始场景 "${project.meta.firstSceneId}" 不存在`,
    });
  }

  // Check for unreachable scenes (not in strict mode, just warn)
  const reachable = findReachableScenes(project);
  project.scenes.forEach((scene) => {
    if (scene.id !== project.meta.firstSceneId && !reachable.has(scene.id)) {
      errors.push({
        path: `scenes[${project.scenes.indexOf(scene)}]`,
        message: `场景 "${scene.name}" 可能无法被到达`,
      });
    }
  });

  return errors;
}

/** Find all scene IDs reachable from the first scene */
function findReachableScenes(project: GameProject): Set<string> {
  const reachable = new Set<string>();
  const queue = [project.meta.firstSceneId];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);

    const scene = project.scenes.find((s) => s.id === id);
    if (!scene) continue;

    if (scene.nextSceneId) queue.push(scene.nextSceneId);
    if (scene.choices) {
      scene.choices.forEach((c) => {
        if (c.nextSceneId) queue.push(c.nextSceneId);
      });
    }
  }

  return reachable;
}

/** Quick check — returns true if the project has no blocking errors */
export function isProjectValid(project: GameProject): boolean {
  return validateProject(project).length === 0;
}
