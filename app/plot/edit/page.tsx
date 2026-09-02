import StagePlotEditor from "@/components/band/StagePlotEditor";

export default function Page() {
  return (
    <StagePlotEditor
      artistKey="plot-standalone"
      backHref="/plot"
      viewHref="/plot"
    />
  );
}
