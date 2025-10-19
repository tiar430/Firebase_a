"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  paymentStatuses,
  programStatuses,
  type Program,
  type Brand,
  type ProgramType,
} from "@/lib/types";
import { getEstimatedReward } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProgramFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (program: Program) => void;
  program: Program | null;
  brands: Brand[];
  programTypes: ProgramType[];
}

const formSchema = z.object({
  programType: z.string().min(1, "Program type is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  target: z.coerce.number().min(0, "Target must be non-negative"),
  achievement: z.coerce.number().min(0, "Achievement must be non-negative"),
  rewardPercentage: z.coerce.number().min(0, "Reward must be non-negative"),
  status: z.enum(programStatuses),
  paymentStatus: z.enum(paymentStatuses),
});

type ProgramFormValues = z.infer<typeof formSchema>;

export function ProgramForm({
  isOpen,
  setIsOpen,
  onSave,
  program,
  brands,
  programTypes,
}: ProgramFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [estimatedReward, setEstimatedReward] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programType: "",
      brand: "",
      description: "",
      target: 0,
      achievement: 0,
      rewardPercentage: 0,
      status: "Pending",
      paymentStatus: "Unpaid",
    },
  });

  useEffect(() => {
    if (program) {
      form.reset({
        ...program,
        startDate: new Date(program.startDate),
        endDate: new Date(program.endDate),
      });
      handleRewardCalculation(program.achievement, program.rewardPercentage);
    } else {
      form.reset({
        programType: "",
        brand: "",
        description: "",
        startDate: undefined,
        endDate: undefined,
        target: 0,
        achievement: 0,
        rewardPercentage: 0,
        status: "Pending",
        paymentStatus: "Unpaid",
      });
      setEstimatedReward(0);
    }
  }, [program, form, isOpen]);

  const achievement = form.watch("achievement");
  const rewardPercentage = form.watch("rewardPercentage");

  useEffect(() => {
    const debouncedCalculation = setTimeout(() => {
       handleRewardCalculation(achievement, rewardPercentage);
    }, 500);

    return () => clearTimeout(debouncedCalculation);
  }, [achievement, rewardPercentage]);

  const handleRewardCalculation = (ach: number, rew: number) => {
    if (typeof ach !== 'number' || typeof rew !== 'number' || isNaN(ach) || isNaN(rew)) return;
    setIsCalculating(true);
    startTransition(async () => {
        const result = await getEstimatedReward({ achievement: ach, rewardPercentage: rew });
        if (result.error) {
            toast({ variant: "destructive", title: "Calculation Error", description: result.error });
        } else {
            setEstimatedReward(result.estimatedReward ?? 0);
        }
        setIsCalculating(false);
    });
  };

  const onSubmit = (values: ProgramFormValues) => {
    const programData: Program = {
      id: program?.id || "",
      ...values,
    };
    onSave(programData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {program ? "Edit Program" : "Add New Program"}
          </DialogTitle>
          <DialogDescription>
            {program
              ? `Editing program ID: ${program.id}`
              : "Fill in the details for the new program."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="programType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Program</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programTypes.map((pt) => (
                          <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Program details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periode Start</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periode End</FormLabel>
                    <FormControl>
                       <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Program</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="achievement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pencapaian</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 8500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="rewardPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormItem>
                    <FormLabel>Estimasi Reward</FormLabel>
                    <div className="flex items-center h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {estimatedReward.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </div>
                </FormItem>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status Program</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {programStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status Pembayaran</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {paymentStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Program"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
