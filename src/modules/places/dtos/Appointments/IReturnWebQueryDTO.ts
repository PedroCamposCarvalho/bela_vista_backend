export default interface IReturnWebQueryDTO {
  id: string;
  start_date: Date;
  finish_date: Date;
  price: number;
  observation: string;
  id_transaction: string;
  type: string;
  created_at: Date;
  ssn: string;
  retrieved: boolean;
  retrieved_date: Date;
  available_in: Date;
}
