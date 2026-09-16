// Patch legacy String.prototype.anchor so that string[].anchor returns the string itself instead of String.prototype.anchor function
if (typeof String.prototype.anchor !== "undefined") {
  try {
    Object.defineProperty(String.prototype, "anchor", {
      get() {
        return this.toString();
      },
      configurable: true,
    });
  } catch {}
}

export {};
