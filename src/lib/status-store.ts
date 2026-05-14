import fs from 'fs/promises';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'status-store.json');

export async function getPreviousStatus(): Promise<Record<string, string>> {
  try {
    const data = await fs.readFile(STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function saveStatus(status: Record<string, string>) {
  await fs.writeFile(STORE_PATH, JSON.stringify(status, null, 2));
}
