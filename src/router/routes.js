import { AdminRoles } from "src/const/adminRoles";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/users",
        component: () => import("pages/UsersPage.vue"),
        meta: { roles: [AdminRoles.RH] },
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
    meta: { requiresAuth: false },
  },
  {
    path: "/unauthorized",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UnauthorizedPage.vue") },
    ],
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
