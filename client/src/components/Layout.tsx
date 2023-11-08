import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div className="w-full flex">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;
