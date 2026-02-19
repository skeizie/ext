import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65`;

export async function fetchExtensions() {
  const response = await fetch(`${BASE_URL}/extensions`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch extensions');
  return response.json();
}

export async function saveExtension(extension: any, accessToken: string) {
  const response = await fetch(`${BASE_URL}/extensions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(extension),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save extension');
  }
  return response.json();
}

export async function deleteExtension(id: string, accessToken: string) {
  const response = await fetch(`${BASE_URL}/extensions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete extension');
  return response.json();
}

export async function migrateData(extensions: any[], accessToken: string) {
  const response = await fetch(`${BASE_URL}/migrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ extensions }),
  });
  if (!response.ok) throw new Error('Migration failed');
  return response.json();
}
