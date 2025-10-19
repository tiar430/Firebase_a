"use client";

import * as React from "react";
import type { Program, Brand, ProgramType } from "@/lib/types";
import { Header } from "./header";
import { DashboardChart } from "./dashboard-chart";
import { KanbanBoard } from "./kanban/kanban-board";
import { ProgramForm } from "./kanban/program-form";
import { useToast } from "@/hooks/use-toast";

interface MainViewProps {
  initialPrograms: Program[];
  initialBrands: Brand[];
  initialProgramTypes: ProgramType[];
}

export function MainView({
  initialPrograms,
  initialBrands,
  initialProgramTypes,
}: MainViewProps) {
  const { toast } = useToast();
  const [programs, setPrograms] = React.useState<Program[]>(initialPrograms);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [brandFilter, setBrandFilter] = React.useState<string>("All");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingProgram, setEditingProgram] = React.useState<Program | null>(null);

  const handleAddNew = () => {
    setEditingProgram(null);
    setIsFormOpen(true);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleDelete = (programId: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== programId));
    toast({
      title: "Program Deleted",
      description: "The program has been successfully removed.",
    });
  };

  const handleSaveProgram = (programData: Program) => {
    if (editingProgram) {
      // Update existing program
      setPrograms((prev) =>
        prev.map((p) => (p.id === programData.id ? programData : p))
      );
      toast({
        title: "Program Updated",
        description: `${programData.id} has been successfully updated.`,
      });
    } else {
      // Add new program
      setPrograms((prev) => [
        { ...programData, id: `PROG-${Date.now()}` },
        ...prev,
      ]);
      toast({
        title: "Program Created",
        description: `A new program has been successfully created.`,
      });
    }
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const filteredPrograms = React.useMemo(() => {
    return programs.filter((program) => {
      const matchesBrand =
        brandFilter === "All" || program.brand === brandFilter;
      const matchesSearch =
        searchQuery === "" ||
        program.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [programs, brandFilter, searchQuery]);
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Generating CSV file for download.",
    });
    // Placeholder for CSV export logic
    console.log("Exporting data to CSV...");
  };

  const handleImport = (file: File) => {
    toast({
      title: "Importing...",
      description: `Processing ${file.name}.`,
    });
    // Placeholder for CSV import logic
    console.log(`Importing data from ${file.name}...`);
  };


  return (
    <div className="flex h-screen w-full flex-col">
      <Header
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImport={handleImport}
        brands={initialBrands}
      />
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:gap-8 md:p-6">
        <DashboardChart programs={filteredPrograms} />
        <KanbanBoard programs={filteredPrograms} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
      <ProgramForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSave={handleSaveProgram}
        program={editingProgram}
        brands={initialBrands}
        programTypes={initialProgramTypes}
      />
    </div>
  );
}
