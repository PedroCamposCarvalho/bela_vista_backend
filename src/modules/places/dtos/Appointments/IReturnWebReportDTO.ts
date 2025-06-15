export default interface IReturnWebReportDTO {
  id: string;
  name: string;
  ssn: string;
  date: Date;
  grossValue: number;
  netValue: number;
  type: number;
  id_transaction: string;
  payment_type: string;
  isAvailable: boolean;
  retrieved: boolean;
  retrieved_date: Date;
  created_at: Date;
  available_in: Date;
}
