import { NextResponse } from 'next/server';
import { MONITORS } from '@/config/monitors';
import { sendDiscordWebhook } from '@/lib/notifications';
import { getPreviousStatus, saveStatus } from '@/lib/status-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (process.env.CRON_KEY && key !== process.env.CRON_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prevStatus = await getPreviousStatus();
  const currentStatusMap: Record<string, string> = {};
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  const results = [];

  for (const monitor of MONITORS) {
    let status = 'UP';
    try {
      const res = await fetch(monitor.url, { 
        method: 'GET', 
        signal: AbortSignal.timeout(5000),
        cache: 'no-store'
      });
      status = (res.status >= 200 && res.status < 400) ? 'UP' : 'DOWN';
    } catch (e) {
      status = 'DOWN';
    }

    currentStatusMap[monitor.url] = status;

    // Check for change
    const oldStatus = prevStatus[monitor.url];
    if (oldStatus && oldStatus !== status && webhookUrl) {
      await sendDiscordWebhook(webhookUrl, {
        affected: monitor.name,
        status: status as any,
        title: `${monitor.name} is ${status === 'UP' ? 'back up' : 'down'}`,
        message: status === 'UP' 
          ? `${monitor.name} is back up. This incident was automatically resolved by monitoring.`
          : `${monitor.name} is down at the moment. This incident was automatically created by monitoring.`,
      });
    }

    results.push({ name: monitor.name, status });
  }

  await saveStatus(currentStatusMap);

  return NextResponse.json({ success: true, results });
}
