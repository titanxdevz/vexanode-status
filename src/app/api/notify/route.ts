import { NextResponse } from 'next/server';
import { sendDiscordWebhook } from '@/lib/notifications';

export async function POST(req: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
  }

  try {
    const { name, status, latency } = await req.json();

    await sendDiscordWebhook(webhookUrl, {
      affected: name,
      status: status || 'DOWN',
      title: `Manual Alert: ${name}`,
      message: `A manual status alert has been triggered for this monitor. The engineering team has been notified and is investigating.`,
      latency: latency || 0,
      incidentUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Notify] Failed:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
