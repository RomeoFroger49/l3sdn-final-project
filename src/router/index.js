import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/auth-store";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const isAuth = useAuthStore().isAuthenticated;
  const roles = useAuthStore().roles;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from) => {
    if (!isAuth && to.path !== "/login") {
      return { path: "/login" };
    }

    if (to.meta.requiresAuth && isAuth) {
      if (to.meta.roles && to.meta.roles.some((role) => roles.includes(role))) {
        return true;
      } else if (
        to.meta.roles &&
        !to.meta.roles.some((role) => roles.includes(role))
      ) {
        return { path: "/unauthorized" };
      } else {
        return true;
      }
    }
  });

  return Router;
});
