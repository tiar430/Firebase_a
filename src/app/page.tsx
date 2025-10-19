import { MainView } from "@/components/brand-pilot/main-view";
import { initialPrograms, initialBrands, initialProgramTypes } from "@/lib/data";

export default function Home() {
  return (
    <MainView
      initialPrograms={initialPrograms}
      initialBrands={initialBrands}
      initialProgramTypes={initialProgramTypes}
    />
  );
}
