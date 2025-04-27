export const vercel = new (class Vercel {
  #environment
  constructor() {
    this.#environment = new (class Environment {
      get DEVELOPMENT() {
        return import.meta.env.VERCEL_ENV === 'development'
      }

      get NAME() {
        return import.meta.env.VERCEL_ENV || null
      }

      get PREVIEW() {
        return import.meta.env.VERCEL_ENV === 'preview'
      }

      get PRODUCTION() {
        return import.meta.env.VERCEL_ENV === 'production'
      }
      

    })();

  }

  get environment() {
    return this.#environment
  }

  get URL() {
    return import.meta.env.VERCEL_URL || null
  }
})();