import origins from "@/meta/origins";

export const meta = {
  PUBLIC: import.meta.env.DEV
    ? "/"
    : `https://${window.parent.location.hostname}/_/theme/dist/`,
  SERVER:
    (["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? origins.development
      : `https://${window.parent.location.hostname}`) + "/_/api",
};
