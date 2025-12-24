
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPosition: [number, number, number];
  treePosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}

export interface OrnamentData {
  scatterPosition: [number, number, number];
  treePosition: [number, number, number];
  scale: number;
}
