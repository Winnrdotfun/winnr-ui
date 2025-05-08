"use client";

import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
import Header from "./Header";
import { showToast } from "../ui/Toast/ToastProvider";

interface LayoutProps extends PropsWithChildren {
  children?: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
