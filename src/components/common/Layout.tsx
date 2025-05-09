"use client";

import { FC, PropsWithChildren, ReactNode } from "react";
import Header from "./Header";

interface LayoutProps extends PropsWithChildren {
  children?: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <Header />
      <main className="py-5">{children}</main>
    </div>
  );
};

export default Layout;
