/*
import { Path } from "@/rolloapp/tools/path.js";
20250526
v.2.1
*/


/* Utility for parsing path. */
export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {
    parcel: false,
  };

  constructor(specifier) {
    /* Do light-weight parsing here; heavier parsing is done lazily. */
    if (specifier.endsWith("/")) {
      /* Accommodate the (Python-package-like) "Rollo-parcel" short-hand syntax */
      specifier = `${specifier}__init__.js`;
      this.#_.parcel = true;
    }
    this.#_.specifier = specifier;
    this.#_.public = specifier.startsWith("/");
  }

  /* Returns file. */
  get file() {
    this.#parse();
    return this.#_.file;
  }

  /* Returns native path. */
  get path() {
    if (this.#_.path === undefined) {
      this.#_.path = this.public
        ? this.specifier
        : `/src/${this.specifier.slice("@/".length)}`;
    }
    return this.#_.path;
  }

  /* Returns parcel flag. */
  get parcel() {
    return this.#_.parcel;
  }

  /* Returns public flag. */
  get public() {
    return this.#_.public;
  }

  /* Returns original specifier (subject to any parcel adjustment). */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns stem. */
  get stem() {
    this.#parse();
    return this.#_.stem;
  }

  /* Returns types. */
  get types() {
    this.#parse();
    return this.#_.types;
  }

  /* Returns type. */
  get type() {
    if (this.#_.type === undefined) {
      this.#_.type = this.types.split(".").reverse().at(0);
    }
    return this.#_.type;
  }

  /* Shared parser to be called by lazy accessor props. */
  #parse() {
    if (this.#_.parsed) return;
    this.#_.file = this.specifier.split("/").reverse()[0];
    const [stem, ...hot] = this.#_.file.split(".");
    this.#_.stem = stem;
    this.#_.types = hot.join(".");
    this.#_.parsed = true;
  }
}

/* NOTE
For future:
- Never use 'specifier' to pack-in information that's better handled by 
  'use' options, e.g., never add '?raw'; much cleaner to go {raw: true} in 
  'use'. This would not only be conceptually problematic, but could also 
  introduce 'specifier' parsing overhead (which should be kept as performant 
  as possible!). As a general rule, it's OK to let 'Path' act as an aux 
  "args provider" for 'use', if it concerns the path itself and not the 
  way the file should be imported and processed. Current examples of 
  appropriate path wrangling includes the '@/'-prefix and the "Rollo-parcel" 
  short hand. This can be powerful, since these syntax rules not only adjust 
  the path, but also sets accessor prop values ('public' and 'parcel'), which 
  in turn can instruct how 'use' operates. I anticipated that this pattern can
  be used to unlock additional strong features of the Rollo import engine.
*/
