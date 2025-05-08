"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactComponent as Logo } from "@/src/assets/images/logo.svg";
import { FC, Suspense, useEffect, useState } from "react";
import { ReactComponent as USDC } from "@/src/assets/icons/usdc.svg";
import dynamic from "next/dynamic";
import classNames from "classnames";
import { getUsdcBalance } from "@/src/api/token/getUsdcBalance";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

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
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0");

  useEffect(() => {
    if (!wallet || !connection) return;
    getUsdcBalance(connection, wallet.publicKey.toBase58()).then((balance) =>
      setUsdcBalance(balance.uiAmount)
    );
  }, [wallet, connection]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="py-4 px-4 sticky top-0 z-50 transition-colors duration-300">
      <div
        className={classNames(
          "py-2 px-4 flex items-center justify-between rounded-2xl transition-all duration-300",
          isScrolled ? "bg-white/5 backdrop-blur-lg" : "bg-transparent"
        )}
      >
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
        <div className="flex flex-row min-w-[127px]">
          <div className="flex items-center gap-2 mx-2">
            <div className="text-neutral-50 heading-h5">{usdcBalance} USDC</div>
            <USDC className="w-4 h-4" />
          </div>
          <Suspense
            fallback={
              <div className="h-10 w-40 bg-neutral-900 rounded-xl animate-pulse" />
            }
          >
            <WalletMultiButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
