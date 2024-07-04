import { initializeSearcher } from "@repo/parser";
import { NextResponse } from "next/server";

const searcher = initializeSearcher(process.cwd());

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const results = await searcher.search(query);
  return NextResponse.json(results);
}
