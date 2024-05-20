import { Button } from "@ui/button";
import Image from "next/image";
import Link from "next/link";
import GithubIcon from "@/public/github-mark-white.svg";

export default function Home() {
  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1 className="text-2xl font-bold">VisualTS</h1>
        <p className="text-lg text-center">
          Visual Editor for TypeScript and React (WIP)
        </p>
        <div className="flex gap-x-4 mt-4 items-center">
          <Button asChild>
            <Link href="/features/code-generator">Code Generator</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/roadmap">Roadmap</Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://github.com/ozhanefemeral/visual-ts"
              passHref
              className="cursor-pointer w-6 h-6 flex items-center justify-center"
            >
              <Image src={GithubIcon} alt="Github" className="max-w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
