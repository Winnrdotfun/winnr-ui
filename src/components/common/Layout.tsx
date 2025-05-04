import { FC, PropsWithChildren, ReactNode } from "react";
import Header from "./Header";

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
