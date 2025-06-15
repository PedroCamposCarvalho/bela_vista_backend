import * as cron from 'node-cron';
import fetch from 'node-fetch';

export default function projectSchedules(): void {
  cron.schedule('* * * * *', async function () {
    console.log('ta rodando o schedule');
    fetch(`http://localhost:8888/appointments/schedulePixPayment`);
  });

  // if (white_label().willRunSchedules) {
  //   cron.schedule('0 12 * * *', async function () {
  //     console.log(`ta rodando as ${new Date()}`);
  //     fetch(`http://localhost:8888/appointments/schedulePaymentReport`);
  //     fetch(`https://dev.pluma.tech/appointments/schedulePaymentReport`);
  //   });

  //   cron.schedule('0 0 */12 * * *', async function () {
  //     fetch(`http://localhost:8888/appointments/updateTypeService`);
  //     // fetch(`https://dev.pluma.tech/appointments/updateTypeService`);
  //   });

  //   cron.schedule('0 0 */12 * * *', async function () {
  //     fetch(`http://localhost:8888/dayUse/updateType`);
  //   });
  // }
}

// cron.schedule('0 9 * * *', async function () {
//   fetch(`http://localhost:8888/appointments/scheduleDailyAppointments`);
// });
