import axios from 'axios';

interface DiscordNotification {
  title: string;
  status: 'UP' | 'DOWN' | 'INVESTIGATING' | 'RESOLVED';
  message: string;
  affected: string;
  latency?: number;
  incidentUrl?: string;
}

const STATUS_COLORS: Record<DiscordNotification['status'], number> = {
  UP: 0x10b981,
  RESOLVED: 0x10b981,
  DOWN: 0xef4444,
  INVESTIGATING: 0x3b82f6,
};

const STATUS_LABELS: Record<DiscordNotification['status'], string> = {
  UP: 'Operational',
  RESOLVED: 'Resolved',
  DOWN: 'Outage',
  INVESTIGATING: 'Investigating',
};

export async function sendDiscordWebhook(webhookUrl: string, data: DiscordNotification): Promise<void> {
  const latencyText = data.latency != null ? `${data.latency}ms` : 'N/A';

  const body: Record<string, unknown> = {
    embeds: [
      {
        color: STATUS_COLORS[data.status],
        title: data.title,
        description: data.message,
        fields: [
          { name: 'System', value: `\`${data.affected}\``, inline: true },
          { name: 'Latency', value: `\`${latencyText}\``, inline: true },
          { name: 'Status', value: `\`${STATUS_LABELS[data.status]}\``, inline: true },
        ],
        footer: {
          text: 'VexaNode Infrastructure',
        },
        timestamp: new Date().toISOString(),
      },
    ],
    flags: 1 << 15,
  };

  if (data.incidentUrl) {
    body.components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'View Status Page',
            url: data.incidentUrl,
          },
        ],
      },
    ];
  }

  try {
    await axios.post(webhookUrl, body);
  } catch (error) {
    console.error('[Discord Webhook] Failed to send notification:', error);
    throw error;
  }
}