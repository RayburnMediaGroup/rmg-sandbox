import StagePlotView from "@/components/band/StagePlotView";

export default function Page() {
  return (
    <StagePlotView
      artistKey="plot-standalone"
      editHref="/plot/edit"
      backHref="/plot/edit"
    />
  );
}
