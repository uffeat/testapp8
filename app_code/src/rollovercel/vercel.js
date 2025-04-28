/* Util for Vercel-related stuff. */
export const vercel = new (class Vercel {
  #environment;
  constructor() {
    this.#environment = new (class Environment {
      /* XXX
      - Vercel's 'preview' corresponds to the GitHub repo's 'development' branch, 
        while Vercel's 'development' pertains to Vercel's dev server.
        This naming mismatch is not elegant, but is not critical.
        Could be corrected by 
        - in this util, purge the PREVIEW prop and redefine the DEVELOPMENT prop, 
          so that is actually reflects Vercel's "preview"
        OR
        - renaming the GitHub repo's 'development' branch. */


      /* Returns development environment flag. */
      get DEVELOPMENT() {
        return import.meta.env.VERCEL_ENV === "development";
      }

      /* Returns environment name flag. */
      get NAME() {
        return import.meta.env.VERCEL_ENV || null;
      }

      /* Returns preview environment flag. */
      get PREVIEW() {
        return import.meta.env.VERCEL_ENV === "preview";
      }

      /* Returns production environment flag. */
      get PRODUCTION() {
        return import.meta.env.VERCEL_ENV === "production";
      }
    })();
  }

  /* Return environment controller. */
  get environment() {
    return this.#environment;
  }

  /* Returns app url. */
  get URL() {
    return import.meta.env.VERCEL_URL || null;
  }
})();
