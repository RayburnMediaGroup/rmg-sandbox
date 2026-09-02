import StagePlotView from "@/components/band/StagePlotView";

export default function Page() {
  return (
    <StagePlotView
      artistKey="template"
      editHref="/bandstack/template/stage-plot/edit"
      backHref="/bandstack/template"
    />
  );
}
