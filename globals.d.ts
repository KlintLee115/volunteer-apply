declare global {
  interface Window {
    grecaptcha: {
      execute: () => Promise<string>;
    };
  }
}

export {};
