import { projectId, publicAnonKey } from "../../utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65`;

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  
  // Extract user token if it was passed in the Authorization header
  let userToken = '';
  const providedAuth = (options.headers as any)?.['Authorization'];
  if (providedAuth && providedAuth.startsWith('Bearer ') && providedAuth !== `Bearer ${publicAnonKey}`) {
    userToken = providedAuth.split(' ')[1];
  }

  // Ensure headers include the apikey and a "gateway-safe" Authorization header
  const headers: Record<string, string> = {
    'apikey': publicAnonKey,
    'Authorization': `Bearer ${publicAnonKey}`, // Always use anon key for gateway passage
    ...Object.fromEntries(Object.entries(options.headers || {})),
  };

  // If we have a real user token, put it in a custom header the gateway won't block
  if (userToken) {
    headers['x-user-token'] = userToken;
    headers['Authorization'] = `Bearer ${publicAnonKey}`; // Override back to anon for gateway
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    
    // If 404, it might need the manual prefix required by some environments
    if (response.status === 404 && !path.startsWith('/make-server-db9c8b65')) {
      const retryUrl = `${BASE_URL}/make-server-db9c8b65${path}`;
      const retryResponse = await fetch(retryUrl, { ...options, headers });
      if (retryResponse.ok) return retryResponse.json();
    }

    console.error(`API Error [${response.status}] ${url}:`, errorText);
    
    let errorMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || parsed.error || errorText;
    } catch (e) { }
    
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
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
