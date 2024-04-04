// declarations.d.ts

// Declare a module for .ttf font files
declare module "*.ttf" {
  const content: string;
  export default content;
}
