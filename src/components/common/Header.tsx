"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactComponent as Logo } from "@/src/assets/images/logo.svg";
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const navList = [
  {
    name: "Contest",
    href: "/",
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
  },
  {
    name: "My contest",
    href: "/my-contest",
  },
  {
    name: "Invite & Earn",
    href: "/invite-earn",
  },
];

const Header: FC = () => {
  const pathname = usePathname();

  return (
    <div className="py-4 px-4">
      <div className="py-2 px-4 bg-transparent flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <ul className="bg-neutral-900 p-1 rounded-2xl flex items-center gap-2">
          {navList.map((item) => (
            <li key={item.name} className="">
              <Link
                href={item.href}
                className={`block py-2.5 px-3 rounded-xl heading-h5 transition-all border ${
                  pathname === item.href
                    ? "text-[#000] bg-green-light border-white/20"
                    : "text-neutral-400 border-neutral-900 hover:text-[#000] hover:bg-green-light hover:border-white/20"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Header;
