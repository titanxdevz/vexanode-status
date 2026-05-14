import axios from 'axios';

interface DiscordNotification {
  title: string;
  status: 'UP' | 'DOWN' | 'INVESTIGATING' | 'RESOLVED';
  message: string;
  affected: string;
  incidentUrl?: string;
}

export async function sendDiscordWebhook(webhookUrl: string, data: DiscordNotification) {
  const colors = {
    UP: 3066993, // Green
    RESOLVED: 3066993,
    DOWN: 15158332, // Red
    INVESTIGATING: 3447003, // Blue
  };

  const statusText = {
    UP: 'back up',
    RESOLVED: 'back up',
    DOWN: 'down',
    INVESTIGATING: 'experiencing issues',
  };

  const embed = {
    title: `${data.affected} is ${statusText[data.status]}`,
    description: '',
    color: colors[data.status],
    fields: [
      {
        name: data.status === 'DOWN' ? 'Investigating' : 'Resolved',
        value: data.message,
      },
      {
        name: 'Affected',
        value: data.affected,
      },
    ],
    footer: {
      text: `Updated: ${new Date().toLocaleString()}`,
    },
    timestamp: new Date().toISOString(),
  };

  const body = {
    embeds: [embed],
    components: data.incidentUrl ? [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'View incident',
            url: data.incidentUrl,
          }
        ]
      }
    ] : []
  };

  try {
    await axios.post(webhookUrl, body);
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
  }
}
