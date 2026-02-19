import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { Contact } from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/admin",
    Component: Admin,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
