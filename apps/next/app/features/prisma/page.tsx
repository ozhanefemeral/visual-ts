import { PrismaGenerator } from "./PrismaGenerator";
import { TryMeButton } from "./components/TryMeButton";

export default function PrismaPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-end justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold">Prisma CRUD Generator</h1>
          <p className="text-muted-foreground">
            Paste your Prisma schema below to generate typed CRUD operations
          </p>
        </div>
        <TryMeButton />
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <PrismaGenerator />
      </div>
    </div>
  );
}
