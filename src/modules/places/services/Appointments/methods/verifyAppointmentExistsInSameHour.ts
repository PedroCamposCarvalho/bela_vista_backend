import { IHoursProps } from '@modules/places/dtos/Appointments/ICreateAppointmentDTO';
import Appointment from '@modules/places/infra/typeorm/entities/Appointments/Appointment';

export default (
  hours: IHoursProps[],
  appointmentsInMonth: Appointment[],
): boolean => {
  let hasAppointment = false;
  hours.map(item => {
    appointmentsInMonth.map(existingAppointment => {
      const day = new Date(existingAppointment.start_date).getDate();
      const month = new Date(existingAppointment.start_date).getMonth();
      const year = new Date(existingAppointment.start_date).getFullYear();
      const hour = new Date(existingAppointment.start_date).getHours();
      const minutes = new Date(existingAppointment.start_date).getMinutes();
      const existingCourt = existingAppointment.id_court;

      const finishDay = new Date(existingAppointment.finish_date).getDate();
      const finishMonth = new Date(existingAppointment.finish_date).getMonth();
      const finishYear = new Date(
        existingAppointment.finish_date,
      ).getFullYear();
      const finishHour = new Date(existingAppointment.finish_date).getHours();
      const finishMinutes = new Date(
        existingAppointment.finish_date,
      ).getMinutes();

      const newDay = new Date(item.start_date).getDate();
      const newMonth = new Date(item.start_date).getMonth();
      const newYear = new Date(item.start_date).getFullYear();
      const newHour = new Date(item.start_date).getHours();
      const newMinutes = new Date(item.start_date).getMinutes();
      const newCourt = item.id_court;

      const newFinishDay = new Date(item.finish_date).getDate();
      const newFinishMonth = new Date(item.finish_date).getMonth();
      const newFinishYear = new Date(item.finish_date).getFullYear();
      const newFinishHour = new Date(item.finish_date).getHours();
      const newFinishMinutes = new Date(item.finish_date).getMinutes();

      if (
        day === newDay &&
        month === newMonth &&
        year === newYear &&
        hour === newHour &&
        minutes === newMinutes &&
        existingCourt === newCourt
      ) {
        hasAppointment = true;
      }

      if (
        finishDay === newFinishDay &&
        finishMonth === newFinishMonth &&
        finishYear === newFinishYear &&
        finishHour === newFinishHour &&
        finishMinutes === newFinishMinutes &&
        existingCourt === newCourt
      ) {
        hasAppointment = true;
      }

      return null;
    });
    return null;
  });

  return hasAppointment;
};
