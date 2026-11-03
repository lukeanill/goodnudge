import { Button, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-4">
        <Badge variant="secondary" className="w-fit">Hello world</Badge>
        <h1 className="font-heading text-5xl leading-none sm:text-7xl">Good Nudge</h1>
        <p className="max-w-prose text-lg">
          Proving the ILLUZION theme: heading font, body font, colours, radius and provider setup.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card on the ILLUZION theme</CardTitle>
          <CardDescription>Semantic tokens only. No hex values in this page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </CardContent>
      </Card>
    </main>
  );
}
