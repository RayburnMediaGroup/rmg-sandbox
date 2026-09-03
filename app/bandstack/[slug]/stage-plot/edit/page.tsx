"use client";

import { useParams } from "next/navigation";
import StagePlotEditor from "@/components/band/StagePlotEditor";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <StagePlotEditor
      artistKey={`bandstack-${slug}-v1`}
      backHref={`/bandstack/${slug}/stage-plot`}
      viewHref={`/bandstack/${slug}/stage-plot`}
    />
  );
}
