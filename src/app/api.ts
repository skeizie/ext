import { projectId, publicAnonKey } from "../../utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65`;

async function apiFetch(path: string, options: RequestInit = {}) {
  // Try the path directly as per standard Supabase routing
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    // If 404, it might need the manual prefix required by some environments
    if (response.status === 404 && !path.startsWith('/make-server-db9c8b65')) {
      const retryUrl = `${BASE_URL}/make-server-db9c8b65${path}`;
      const retryResponse = await fetch(retryUrl, options);
      if (retryResponse.ok) return retryResponse.json();
    }

    const errorText = await response.text();
    console.error(`API Error [${response.status}] ${url}:`, errorText);
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}

export async function fetchExtensions() {
  return apiFetch('/extensions', {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
}

export async function saveExtension(extension: any, accessToken: string) {
  return apiFetch('/extensions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(extension),
  });
}

export async function deleteExtension(id: string, accessToken: string) {
  return apiFetch(`/extensions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}

export async function migrateData(extensions: any[], accessToken: string) {
  return apiFetch('/migrate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ extensions }),
  });
}

export async function fetchTickets() {
  return apiFetch('/support', {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
}

export async function submitTicket(ticket: { email: string, subject: string, message: string }) {
  return apiFetch('/support', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(ticket),
  });
}

export async function replyToTicket(ticketId: string, reply: string, accessToken: string) {
  return apiFetch('/support/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ticketId, reply }),
  });
}

export async function deleteTicket(id: string, accessToken: string) {
  return apiFetch(`/support/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}
