Controller for Vite import map (result of 'import.meta.glob'). 
NOTE
- Intended as a key part of Rollo's central import engine, but can be used 
  stand-alone or to extend the engine.
- Modes:
  - Non-local (default):
    - Import map items are registered and retrieved centrally to prevent 
      duplication (duplicates are silently ignored).
    - Path keys are registered locally to provide fast batch imports and to 
      guard against misuse of processors.
  - Local:
    - Import map items are registered and retrieved locally to provide 
      slightly faster imports - at the expense of potential redundant items.
- Supports the '@/'-syntax and import from base.
- Supports batch imports.
- Option for cached preprocessing.
- 'strict' option (default) enforces single-file type import map to 
  guard against misuse of processors and for general organization discipline.
  Also allows use of ''import' without file type.
  If 'type' is not provided expilcitly provided at construction, it is inferred.
- Best practices:
  - Use 'strict' and provide 'type' explicitly.
  - Call 'import' with file type.
  - For non-global import maps, always use the 'base' option.
  - 'import.meta.glob' should be used with
      `{ query: "?raw", import: "default" }` kwargs for raw imports
    and
      no kwargs for non-raw imports.
    Other combinations will likely work, but may not leverage the full 
    potential of 'Modules'.
  - For raw imports in local mode, it is not necessary to specify 'query'.
    Should, however, be done for consistency.
- Although tyically used for wrapping Vite import maps, custom objects with similar 
  shape can also be used.



  XXX
  - The constructor kwargs must be manually coordinated with the 
    'import.meta.glob' args. This is not ideal, but required, since
    'import.meta.glob' args must be static in non-DEV. NOT CRITICAL!
    Re each kwarg (just for fun):
    - 'type' can be easily inferred
    - 'base' could probably be inferred by looking for a common pattern,
      when parsing map items; probably not cheap and not worthwhile.
    - 'query' could probably be inferred by doing a "test import"
      and check, if string - or by postponing query setting until first 
      import; probably over-engineering and not worthwhile.
    Could probably also use 'import.meta.glob' with dynamic args in DEV
    only and then register these (via a local endpoint) for use in non-DEV.
    Probably also possible to do other kinds of pseudo-static analysis in
    DEV... Super fun, but certainly over-engineering and not worthwhile!
  - 'local' does not have to be coordinated with 'import.meta.glob' args,
    but could be set automatically, if global redundacy is detected.
    However, too much magic and loss of control. Don't do it!