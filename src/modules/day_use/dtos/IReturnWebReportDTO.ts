export default interface IReturnWebReportDTO {
  id: string;

  start_date: Date;

  observation: string;

  paid_price: number;

  type: string;

  created_at: Date;

  payment_retrieved: boolean;

  ssn: string;

  id_transaction: string;
}
