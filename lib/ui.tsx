"use client";

// Client boundary for @lukeanill/ui.
//
// Several package components use hooks/context but ship without a "use client"
// directive (audit: 48 files in v6.0.3), so importing them straight into a
// server component can crash at build or render. Import package components from
// here instead of from "@lukeanill/ui/components/*" in pages and layouts.
// When you need a new component, add one re-export line below.

export { Button } from "@lukeanill/ui/components/button";
export { Badge } from "@lukeanill/ui/components/badge";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@lukeanill/ui/components/card";
