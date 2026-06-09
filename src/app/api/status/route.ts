import { NextResponse } from 'next/server';
import { MONITORS } from '@/config/monitors';

let cached: { data: object | null; expiry: number } = { data: null, expiry: 0 };

async function pingUrl(url: string) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - start;
    const status = res.status >= 200 && res.status < 400 ? 'UP' : 'DOWN';
    return { status, latency };
  } catch {
    return { status: 'DOWN', latency: 0 };
  }
}

export async function GET() {
  const now = Date.now();

  if (cached.data && now < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  const results = await Promise.all(
    MONITORS.map(async (config) => {
      const { status, latency } = await pingUrl(config.url);
      return {
        name: config.name,
        url: config.url,
        status,
        latency,
        checkedAt: new Date().toISOString(),
      };
    })
  );

  const onlineCount = results.filter((r) => r.status === 'UP').length;

  const body = {
    success: true,
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      online: onlineCount,
      offline: results.length - onlineCount,
      avgLatency: results.length > 0
        ? Math.round(results.reduce((a, b) => a + b.latency, 0) / results.length)
        : 0,
      availability: results.length > 0
        ? Math.round((onlineCount / results.length) * 100)
        : 0,
    },
    results,
    cached: false,
  };

  cached = { data: body, expiry: now + 60_000 };

  return NextResponse.json(body);
}
