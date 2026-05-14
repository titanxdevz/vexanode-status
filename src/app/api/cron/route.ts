import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MONITORS } from '@/config/monitors';
import { sendDiscordWebhook } from '@/lib/notifications';

// Helper to ping a URL
async function pingUrl(url: string) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const latency = Date.now() - start;
    const status = res.status >= 200 && res.status < 400 ? 'UP' : 'DOWN';
    return { status, latency };
  } catch (e) {
    return { status: 'DOWN', latency: 0 };
  }
}

export async function GET() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set');
  }

  const results = [];

  for (const config of MONITORS) {
    // 1. Get or create monitor in DB
    let monitor = await prisma.monitor.findFirst({
      where: { url: config.url }
    });

    if (!monitor) {
      monitor = await prisma.monitor.create({
        data: {
          name: config.name,
          url: config.url,
          status: 'UP',
        }
      });
    }

    // 2. Ping the node
    const { status, latency } = await pingUrl(config.url);
    const prevStatus = monitor.status;

    // 3. Save heartbeat
    await prisma.heartbeat.create({
      data: {
        monitorId: monitor.id,
        status,
        latency,
      }
    });

    // 4. Handle status change
    if (status !== prevStatus) {
      // Update monitor status
      await prisma.monitor.update({
        where: { id: monitor.id },
        data: { status, lastChecked: new Date() }
      });

      if (webhookUrl) {
        if (status === 'DOWN') {
          // Create incident
          const incident = await prisma.incident.create({
            data: {
              title: `Outage: ${config.name}`,
              status: 'INVESTIGATING',
              severity: 'MAJOR',
              monitorId: monitor.id,
              updates: {
                create: {
                  message: `Automated monitoring detected an outage for ${config.name}. The engineering team has been notified.`,
                  status: 'INVESTIGATING'
                }
              }
            }
          });

          await sendDiscordWebhook(webhookUrl, {
            affected: config.name,
            status: 'DOWN',
            title: `Outage Detected: ${config.name}`,
            message: `System is unreachable. The engineering team has been notified and is investigating.`,
            latency,
            incidentUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/`
          });
        } else if (status === 'UP') {
          // Resolve incidents
          const activeIncidents = await prisma.incident.findMany({
            where: { monitorId: monitor.id, status: { not: 'RESOLVED' } }
          });

          for (const incident of activeIncidents) {
            await prisma.incident.update({
              where: { id: incident.id },
              data: { status: 'RESOLVED' }
            });
            await prisma.incidentUpdate.create({
              data: {
                incidentId: incident.id,
                message: `System has recovered and is now operating normally.`,
                status: 'RESOLVED'
              }
            });
          }

          await sendDiscordWebhook(webhookUrl, {
            affected: config.name,
            status: 'UP',
            title: `System Recovered: ${config.name}`,
            message: `Service has been restored and is operating normally.`,
            latency,
          });
        }
      }
    } else {
      // Update last checked time anyway
      await prisma.monitor.update({
        where: { id: monitor.id },
        data: { lastChecked: new Date() }
      });
    }

    results.push({ name: config.name, status, latency });
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results
  });
}
