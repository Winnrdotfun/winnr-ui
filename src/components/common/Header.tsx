"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/src/assets/images/logo.svg";
import { FC, Suspense, useEffect, useState } from "react";
import USDC from "@/src/assets/icons/usdc.svg";
import classNames from "classnames";
import { getUsdcBalance } from "@/src/api/token/getUsdcBalance";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import WalletConnectButton from "./WalletConnectButton";

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

const ButtonGroup = ({ className }: { className?: string }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [usdcBalance, setUsdcBalance] = useState("0");

  useEffect(() => {
    if (!wallet || !connection) return;
    getUsdcBalance(connection, wallet.publicKey.toBase58()).then((balance) =>
      setUsdcBalance(balance.uiAmount)
    );
  }, [wallet, connection]);

  return (
    <div className={classNames("flex", className)}>
      <div className="flex items-center gap-2 mx-2">
        <div className="text-neutral-50 heading-h5">{usdcBalance}</div>
        <Image src={USDC} alt="usdc" width={16} height={16} />
      </div>
      <Suspense
        fallback={
          <div className="h-10 w-40 bg-neutral-900 rounded-xl animate-pulse" />
        }
      >
        <WalletConnectButton />
      </Suspense>
    </div>
  );
};

const Header: FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header className="py-4 px-4 sticky top-0 z-50 transition-colors duration-300 lg:p-2 md:p-1">
      <div
        className={classNames(
          "py-2 px-4 flex md:flex-col md:gap-6 items-center justify-between rounded-2xl transition-all duration-300",
          isScrolled ? "bg-white/5 backdrop-blur-lg" : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between gap-2 md:w-full">
          <Link href="/">
            <Image
              src={Logo}
              alt="logo"
              width={152}
              height={32}
              className="lg:max-w-[120px] sm:max-w-[100px]"
            />
          </Link>
          <ButtonGroup className="hidden md:flex" />
        </div>
        <div className="flex justify-center gap-2 sm:w-full">
          <ul className="bg-neutral-900 p-1 rounded-2xl md:rounded-lg flex items-center gap-2 md:overflow-x-auto">
            {navList.map((item) => (
              <li key={item.name} className="">
                <Link
                  href={item.href}
                  className={`block py-2.5 px-3 lg:px-2 lg:py-1.5 md:whitespace-nowrap md:px-1.5 md:py-1 rounded-xl md:rounded-lg heading-h5 transition-all border ${
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
        </div>
        <ButtonGroup className="md:hidden flex" />
      </div>
    </header>
  );
};

export default Header;
