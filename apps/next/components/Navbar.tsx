"use client";

import { usePathname } from "next/navigation";
import { Button } from "@ui/button";
import Link from "next/link";
import GithubIcon from "@/public/github-mark-white.svg";
import Image from "next/image";

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
}
const NavbarLink: React.FC<NavbarLinkProps> = ({ href, children }) => {
  const isActive = usePathname() === href;
  return (
    <Button
      asChild
      variant="link"
      className={`${isActive ? "underline text-blue-500" : ""}`}
    >
      <Link
        href={href}
        className="flex items-center justify-center w-full h-full"
      >
        {children}
      </Link>
    </Button>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="flex items-center flex-shrink-0">
        <span className="font-semibold text-xl tracking-tight">
          <Link href="/">VisualTS</Link>
        </span>
      </div>
      <div className="flex gap-x-4 items-center">
        <NavbarLink href="/features/code-generator">Code Generator</NavbarLink>
        <NavbarLink href="/roadmap">Roadmap</NavbarLink>
        <Link
          href="https://github.com/ozhanefemeral/visual-ts"
          passHref
          className="cursor-pointer w-6 h-6 flex items-center justify-center"
        >
          <Image src={GithubIcon} alt="Github" className="max-w-6" />
        </Link>
      </div>
    </nav>
  );
};
