import { PrismaGenerator } from "./PrismaGenerator";

export default function PrismaPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">prisma crud generator</h1>
        <p className="text-muted-foreground">
          paste your prisma schema below to generate typed crud operations
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <PrismaGenerator />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>protip: start with a simple model like:</p>
        <pre className="mt-2 p-2 bg-muted rounded">
          {`model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`}
        </pre>
      </div>
    </div>
  );
}
