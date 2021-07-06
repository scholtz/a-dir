import { createWebHistory, createRouter } from "vue-router";
import Index from "@/pages/Index.vue";
import Add from "@/pages/Add.vue";
import AddPlace from "@/pages/AddPlace.vue";
import AddEShop from "@/pages/AddEShop.vue";
import AddService from "@/pages/AddService.vue";
import Info from "@/pages/Info.vue";
import Admin from "@/pages/Admin.vue";
import NotFound from "@/pages/404.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
  },
  {
    path: "/add",
    name: "add",
    component: Add,
  },
  {
    path: "/info/:id",
    name: "info",
    component: Info,
  },
  {
    path: "/info/:id/:ip",
    name: "info-ip",
    component: Info,
  },
  {
    path: "/search/:newTag",
    name: "search",
    component: Index,
  },
  {
    path: "/add/place",
    name: "addPlace",
    component: AddPlace,
  },
  {
    path: "/add/eshop",
    name: "add-eshop",
    component: AddEShop,
  },
  {
    path: "/add/service",
    name: "add-service",
    component: AddService,
  },
  {
    path: "/edit/service/:id/:ip",
    name: "edit-service-ip",
    component: AddService,
  },
  {
    path: "/edit/place/:id/:ip",
    name: "edit-place-ip",
    component: AddPlace,
  },
  {
    path: "/edit/eshop/:id/:ip",
    name: "edit-eshop-ip",
    component: AddEShop,
  },
  {
    path: "/edit/service/:id",
    name: "edit-service",
    component: AddService,
  },
  {
    path: "/edit/place/:id",
    name: "edit-place",
    component: AddPlace,
  },
  {
    path: "/edit/eshop/:id",
    name: "edit-eshop",
    component: AddEShop,
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
