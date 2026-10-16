"use client";

import { useParams } from "next/navigation";
import StagePlotView from "@/components/band/StagePlotView";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <StagePlotView
      artistKey={`bandstack-${slug}-v1`}
      slug={slug}
      editHref={`/bandstack/${slug}/stage-plot/edit`}
      backHref={`/bandstack/${slug}`}
    />
  );
}
