import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const [k, ...r] = t.split('=');
  if (k && r.length) process.env[k.trim()] = r.join('=').trim();
}

const token = process.env.SANITY_API_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// Check token via REST
const res = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/users/me`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await res.json();
console.log('Token check status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));
