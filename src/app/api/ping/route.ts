import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ status: 'DOWN', latency: 0 }, { status: 400 });
  }

  const start = Date.now();
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - start;
    const status = res.status >= 200 && res.status < 400 ? 'UP' : 'DOWN';
    return NextResponse.json({ status, latency });
  } catch {
    return NextResponse.json({ status: 'DOWN', latency: 0 });
  }
}
