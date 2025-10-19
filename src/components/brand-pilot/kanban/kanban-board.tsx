"use client";

import { useMemo } from "react";
import type { Program, ProgramStatus } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { programStatuses } from "@/lib/types";

interface KanbanBoardProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
}

export function KanbanBoard({ programs, onEdit, onDelete }: KanbanBoardProps) {
  const columns = useMemo(() => {
    const grouped: Record<ProgramStatus, Program[]> = {
      Active: [],
      Pending: [],
      Ended: [],
    };

    programs.forEach((program) => {
      if (grouped[program.status]) {
        grouped[program.status].push(program);
      }
    });
    return grouped;
  }, [programs]);

  return (
    <div className="grid flex-1 items-start gap-4 md:grid-cols-3">
      {programStatuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          programs={columns[status]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
