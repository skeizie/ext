import { supabase } from "./supabaseClient";
import { publicAnonKey } from "../../utils/supabase/info";

const FUNCTION_NAME = 'make-server-db9c8b65';

async function apiFetch(path: string, options: any = {}) {
  // Extract path and method
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : undefined;
  
  // Extract user token from headers if present
  let userToken = '';
  const authHeader = options.headers?.['Authorization'] || options.headers?.['x-user-token'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userToken = authHeader.split(' ')[1];
  } else if (authHeader && authHeader !== publicAnonKey) {
    userToken = authHeader;
  }

  // Use the official Supabase invoke method which handles gateway auth correctly
  const { data, error } = await supabase.functions.invoke(`${FUNCTION_NAME}${path}`, {
    method,
    body,
    headers: userToken ? { 'x-user-token': userToken } : {}
  });

  if (error) {
    console.error(`API Error [${method}] ${path}:`, error);
    throw new Error(error.message || `Request failed`);
  }

  return data;
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
