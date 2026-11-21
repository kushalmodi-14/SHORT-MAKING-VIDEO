declare module '@remotion/bundler' {
  export const bundle: any;
}

declare module '@remotion/renderer' {
  export const selectComposition: any;
  export const renderMedia: any;
  export const renderStill: any;
}

declare module 'ffmpeg-static' {
  const path: string;
  export default path;
}
