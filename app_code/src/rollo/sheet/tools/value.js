export const __ = new Proxy({}, {
  get(target, key) {
    return `var(--${key.replaceAll("_", "-")})`;
  },
});
export const important = (text) => `${text} !important`;
export const px = (number) => `${number}px`;
export const rem = (number) => `${number}rem`;

