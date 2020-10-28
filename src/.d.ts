/// <reference types="preact" />

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg' {
  const content: preact.ComponentType<any>;
  export default content
}
