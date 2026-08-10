// ============================================================
// Default values & demo data for the GAL editor
// ============================================================

import type { GameProject, GameVariable } from '../types/game';

/** Default resolution (1080p) */
export const DEFAULT_RESOLUTION = { width: 1920, height: 1080 };

/** Default game variables available in every new project */
export const DEFAULT_VARIABLES: GameVariable[] = [];

/** Creates a blank new project */
export function createEmptyProject(): GameProject {
  const now = new Date().toISOString();
  return {
    meta: {
      title: '未命名项目',
      version: '0.1.0',
      author: '',
      resolution: { ...DEFAULT_RESOLUTION },
      firstSceneId: '',
      createdAt: now,
      updatedAt: now,
    },
    scenes: [],
    variables: [...DEFAULT_VARIABLES],
    assets: {
      videos: [],
      images: [],
      audios: [],
    },
  };
}

/** Demo project data for testing / quick-start */
export function createDemoProject(): GameProject {
  const project = createEmptyProject();
  project.meta.title = 'Demo 项目';
  project.scenes = [
    {
      id: 'scene_start',
      name: '开场',
      type: 'video',
      videoSrc: 'assets/videos/opening.mp4',
      subtitles: [
        { startTime: 0, endTime: 3, text: '这是故事的开始...' },
        { startTime: 3, endTime: 6, text: '你来到了这所学校。' },
      ],
      choices: [
        {
          id: 'choice_1',
          text: '去教室看看',
          nextSceneId: 'scene_classroom',
        },
        {
          id: 'choice_2',
          text: '去操场逛逛',
          nextSceneId: 'scene_playground',
        },
      ],
    },
    {
      id: 'scene_classroom',
      name: '教室',
      type: 'dialogue',
      dialogue: [
        { speaker: '同学A', text: '嘿，新来的！这边有空位。' },
        { speaker: '你', text: '谢谢。' },
        { speaker: '同学A', text: '我叫李明，以后多多关照！' },
      ],
      nextSceneId: 'scene_ending',
    },
    {
      id: 'scene_playground',
      name: '操场',
      type: 'dialogue',
      dialogue: [
        { speaker: '体育生', text: '喂！小心球！' },
        { speaker: '你', text: '啊！' },
      ],
      nextSceneId: 'scene_ending',
    },
    {
      id: 'scene_ending',
      name: '放学',
      type: 'ending',
      dialogue: [
        { speaker: '旁白', text: '第一天结束了。明天又会发生什么呢？' },
      ],
    },
  ];
  project.meta.firstSceneId = 'scene_start';
  return project;
}

/** Supported file extensions for asset import */
export const SUPPORTED_ASSETS = {
  video: ['.mp4', '.webm', '.mov'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  audio: ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
};
