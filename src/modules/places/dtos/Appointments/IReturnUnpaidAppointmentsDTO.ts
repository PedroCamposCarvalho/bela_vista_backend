// query.distinctOn(['appointments.id_transaction']);
// query.select('appointments.id', 'id');
// query.addSelect('appointments.start_date', 'start_date');
// query.addSelect('appointments.finish_date', 'finish_date');
// query.addSelect('appointments.observation', 'observation');
// query.addSelect('apo_material.amount', 'amount');
// query.addSelect('mat.material', 'material');

export default interface IReturnUnpaidAppointmentsDTO {
  id: string;
  start_date: Date;
  finish_date: Date;
  observation: string;
  id_transaction: string;
  created_at: Date;
  amount: number;
  material: number;
}
