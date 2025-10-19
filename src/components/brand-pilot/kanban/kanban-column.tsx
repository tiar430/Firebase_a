"use client";

import type { Program, ProgramStatus } from "@/lib/types";
import { ProgramCard } from "./program-card";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  status: ProgramStatus;
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
}

const statusColors: Record<ProgramStatus, string> = {
    Active: "bg-blue-500",
    Pending: "bg-yellow-500",
    Ended: "bg-gray-500"
}

export function KanbanColumn({ status, programs, onEdit, onDelete }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="font-headline text-lg font-semibold">{status}</h2>
        <Badge variant="secondary" className="rounded-full">{programs.length}</Badge>
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-muted/50 p-4">
        {programs.length > 0 ? (
          programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-sm text-muted-foreground">No programs</p>
          </div>
        )}
      </div>
    </div>
  );
}
