/* Stylesheets */
import "@/main.css";
import "@/libs/bootstrap/bootstrap.css";
/* Rollo */
import { App } from "rollo/app";
import { Router } from "rollo/router/router";
import { component } from "rollo/component/component";
/* Rolloui */
import { layout } from "@/rolloui/components/layout/layout";
import { Page } from "@/rolloui/components/page";
import { Error_ } from "rolloui/error";
/* App-specific navs */
import { MainNav } from "@/components/navs/main";
import { UserNav } from '@/components/navs/user'
/* App-specific pages */
import { About } from "@/components/pages/about";
import { Colors } from "@/components/pages/colors";
import { Home } from "@/components/pages/home";
import { Terms } from "@/components/pages/terms";




import { modal } from "rolloui/modal/modal";
//modal()

const app = App({ parent: document.body });




/* Configure layout and router */
app.append(layout);

UserNav(layout)

const page = Page({ parent: layout });

const router = Router({
  "/": (change) => {
    page.child.update(Home(change));
  },
  "/about": (change) => {
    page.child.update(About(change));
  },
  "/colors": (change) => {
    page.child.update(Colors(change));
  },
  "/terms": (change) => {
    page.child.update(Terms(change));
  },
});
router.config.error = (path) =>
  page.child.update(Error_(`Invalid path: ${path}`));

MainNav(layout, (self) => {
  self.active.effects.add(({ current }) => router.go(current.path), {run: false});
  router.effects.add(({ current }) => {
    const link = self.find(`[path="${current}"]`);
    if (link) {
      self.active.update(link);
    }
  }, {run: false});
});

layout.append(
  component.a(
    { slot: "home", cursor: "pointer", path: "/" },
    component.h3({}, "Home"),
    (self) => {
      self.on.click = (event) => {
        event.preventDefault();
        router.go("/");
      };
    }
  )
);

router.use();


