declare global {
  interface Window {
    grecaptcha: {
      execute: (action: string) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

export {};
