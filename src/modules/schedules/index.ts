import * as cron from 'node-cron';
import fetch from 'node-fetch';

export default function projectSchedules(): void {
  cron.schedule('* * * * *', async function () {
    console.log('Schedule check unpaid appointments is running');
    try {
      const response = await fetch('http://localhost:8888/appointments/check-unpaid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to check unpaid appointments:', await response.text());
      }
    } catch (error) {
      console.error('Error checking unpaid appointments:', error);
    }
  });
}