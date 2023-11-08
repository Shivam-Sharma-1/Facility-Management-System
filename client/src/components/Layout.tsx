import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { FC } from "react";

const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full flex">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;
