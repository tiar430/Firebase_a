export const programStatuses = ["Active", "Pending", "Ended"] as const;
export const paymentStatuses = ["Paid", "Unpaid", "Partial"] as const;

export type ProgramStatus = typeof programStatuses[number];
export type PaymentStatus = typeof paymentStatuses[number];

export type Brand = string;
export type ProgramType = string;

export interface Program {
  id: string;
  programType: ProgramType;
  brand: Brand;
  description: string;
  startDate: Date;
  endDate: Date;
  target: number;
  achievement: number;
  rewardPercentage: number;
  status: ProgramStatus;
  paymentStatus: PaymentStatus;
}
