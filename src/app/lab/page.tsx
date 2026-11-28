import type { Metadata } from "next";
import { catalog } from "@/data/catalog";
import { OnCall } from "@/components/on-call";

export const metadata: Metadata = {
  title: "On call (test)",
  description: "A test page: drive the repair robot and keep the racks online. Each rack is one GitHub repository.",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <OnCall entries={catalog} />;
}
