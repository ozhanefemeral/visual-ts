import { Separator } from "@/components/ui/separator";
import React from "react";

export default function RoadmapPage() {
  return (
    <div className="container mx-auto py-8 flex flex-col gap-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Roadmap</h1>
        <p className="italic text-sm">
          This roadmap is subject to change as the project evolves. Order of the
          items does not represent priority. Feel free to contact me if you have
          any suggestions or feedback. <br />{" "}
          <span className="font-bold">p.s. Any contribution is welcome!</span>
        </p>
      </div>
      <Separator />
      <div>
        <h2 className="text-2xl font-bold mb-4">Code Generation</h2>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            Implement canvas drag and drop for &quot;map-like&quot; interface
          </li>
          <li>Implement conditions and loops</li>
          <li>
            Improvements such as <code>Promise.all</code> or similar
          </li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-8">
          Integration and Extensibility
        </h2>
        <ul className="list-disc pl-8 space-y-2">
          <li>Integrate with React components</li>
          <li>
            Integrate with Next.js API routes, server components and server
            actions
          </li>
          <li>Integrate with Remix server-side rendering</li>
          <li>Publish core functionalities as a library</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-8">Testing and Deployment</h2>
        <ul className="list-disc pl-8 space-y-2">
          <li>Implement unit tests for components</li>
          <li>Implement unit tests for code-generation and parsing</li>
          <li>Set up CI/CD pipeline</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-8">
          Documentation and User (Developer) Experience
        </h2>
        <ul className="list-disc pl-8 space-y-2">
          <li>Create documentation </li>
          <li>Create Contribution guidelines</li>
          <li>Create Github issue template</li>
          <li>
            Add more examples for code-generation and module/component parsing
          </li>
        </ul>
      </div>
    </div>
  );
}
