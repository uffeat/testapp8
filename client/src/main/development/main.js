import "@/rollotest/__init__.js";



console.info("Vite environment:", import.meta.env.MODE);

/* Trigger build */
window.addEventListener("keydown", async (event) => {
    /* Builds md-parsed files */
    if (event.code === "KeyD" && event.shiftKey) {
      await import("@/main/development/rollomd/__init__.js");
      console.info(`Built md-parsed files.`);
      return;
    }
    /* Updates meta files */
    if (event.code === "KeyM" && event.shiftKey) {
      await import("@/main/development/rollometa/__init__.js");
      console.info(`Meta files updated.`);
      return;
    }
  });
