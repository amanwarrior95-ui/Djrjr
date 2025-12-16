export enum GenerationStatus {
  IDLE = 'IDLE',
  ENHANCING_PROMPT = 'ENHANCING_PROMPT',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum ImageStyle {
  CINEMATIC = 'Cinematic',
  REALISTIC = 'Ultra Realistic',
  ANIME = 'Anime / Manga',
  THREE_D = '3D Render',
  SKETCH = 'Sketch / Pencil Art',
  FANTASY = 'Fantasy / Sci-Fi',
  MINIMAL = 'Minimal Clean'
}

export interface GeneratedImage {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  imageUrl: string;
  aspectRatio: string;
  style: ImageStyle;
  timestamp: number;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9'
}