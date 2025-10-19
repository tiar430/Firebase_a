"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Program } from "@/lib/types";

interface ProgramCardProps {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (programId: string) => void;
}

export function ProgramCard({ program, onEdit, onDelete }: ProgramCardProps) {
  const {
    achievementProgress,
    timeGoneProgress,
    remainingTarget,
    formattedStartDate,
    formattedEndDate,
    paymentStatusVariant,
  } = useMemo(() => {
    const achProgress =
      program.target > 0 ? (program.achievement / program.target) * 100 : 0;
    
    const today = new Date();
    const totalDays = differenceInDays(program.endDate, program.startDate);
    const daysGone = differenceInDays(today, program.startDate);
    let tgProgress = totalDays > 0 ? (daysGone / totalDays) * 100 : 0;
    if (tgProgress < 0) tgProgress = 0;
    if (tgProgress > 100) tgProgress = 100;
    
    const psv: "default" | "secondary" | "destructive" | "outline" =
        program.paymentStatus === "Paid" ? "default" :
        program.paymentStatus === "Partial" ? "secondary" : "outline";


    return {
      achievementProgress: Math.round(achProgress),
      timeGoneProgress: Math.round(tgProgress),
      remainingTarget: program.target - program.achievement,
      formattedStartDate: format(program.startDate, "MMM d"),
      formattedEndDate: format(program.endDate, "MMM d, yyyy"),
      paymentStatusVariant: psv,
    };
  }, [program]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold leading-tight">{program.brand}</CardTitle>
            <CardDescription className="text-xs">{program.programType}</CardDescription>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(program)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the program "{program.id}" for {program.brand}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(program.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="pt-2 text-sm text-muted-foreground">{program.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Achievement</span>
            <span>{achievementProgress}%</span>
          </div>
          <Progress value={achievementProgress} aria-label={`${achievementProgress}% achievement`} />
           <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{program.achievement.toLocaleString()} / {program.target.toLocaleString()}</span>
            <span className={remainingTarget > 0 ? 'text-orange-600' : 'text-green-600'}>
                {remainingTarget > 0 ? `${remainingTarget.toLocaleString()} left` : `${Math.abs(remainingTarget).toLocaleString()} over`}
            </span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Time Gone</span>
            <span>{timeGoneProgress}%</span>
          </div>
          <Progress value={timeGoneProgress} aria-label={`${timeGoneProgress}% time gone`} indicatorClassName="bg-accent" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formattedStartDate}</span>
            <span>{formattedEndDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Badge variant={paymentStatusVariant}>{program.paymentStatus}</Badge>
      </CardFooter>
    </Card>
  );
}
