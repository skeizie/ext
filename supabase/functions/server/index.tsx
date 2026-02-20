import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors());

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const PREFIX = 'extension:';

// Helper to check auth
async function getUser(c: any) {
  try {
    // Check custom header first (bypass gateway JWT issues), then fallback to Authorization
    const userToken = c.req.header('x-user-token');
    const authHeader = c.req.header('Authorization');
    
    const accessToken = userToken || (authHeader ? authHeader.split(' ')[1] : null);
    if (!accessToken) return null;
    
    // Explicitly check if it's the public anon key or service role key
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (accessToken === anonKey || accessToken === serviceKey) {
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      console.log('Auth verification failed:', error.message);
      return null;
    }
    return user || null;
  } catch (err) {
    console.error('getUser error:', err);
    return null;
  }
}

// Routes
// Note: Each route must be prefixed with /make-server-db9c8b65 as per instructions
const baseRoute = '/make-server-db9c8b65';

const extensionsGet = async (c: any) => {
  try {
    const extensions = await kv.getByPrefix(PREFIX);
    return c.json(extensions || []);
  } catch (error) {
    console.error('Error fetching extensions:', error);
    return c.json({ error: 'Failed to fetch extensions' }, 500);
  }
};
app.get(`${baseRoute}/extensions`, extensionsGet);
app.get('/extensions', extensionsGet);

const extensionsPost = async (c: any) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const extension = await c.req.json();
    if (!extension.id) {
      extension.id = Math.random().toString(36).substring(2, 11);
    }
    await kv.set(`${PREFIX}${extension.id}`, extension);
    return c.json({ success: true, extension });
  } catch (error) {
    console.error('Error saving extension:', error);
    return c.json({ error: 'Failed to save extension' }, 500);
  }
};
app.post(`${baseRoute}/extensions`, extensionsPost);
app.post('/extensions', extensionsPost);

const extensionsDelete = async (c: any) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const id = c.req.param('id');
  try {
    await kv.del(`${PREFIX}${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting extension:', error);
    return c.json({ error: 'Failed to delete extension' }, 500);
  }
};
app.delete(`${baseRoute}/extensions/:id`, extensionsDelete);
app.delete('/extensions/:id', extensionsDelete);

const extensionsReorder = async (c: any) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { extensions } = await c.req.json();
    for (const ext of extensions) {
      await kv.set(`${PREFIX}${ext.id}`, ext);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error('Error reordering extensions:', error);
    return c.json({ error: 'Failed to reorder extensions' }, 500);
  }
};
app.post(`${baseRoute}/extensions/reorder`, extensionsReorder);
app.post('/extensions/reorder', extensionsReorder);

app.post(`${baseRoute}/signup`, async (c) => {
  try {
    const initialized = await kv.get('system:initialized');
    if (initialized) {
      return c.json({ error: 'System already initialized. Signup is disabled.' }, 403);
    }

    const { email, password, name } = await c.req.json();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });
    
    if (error) throw error;
    await kv.set('system:initialized', true);
    return c.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message }, 400);
  }
});

app.post(`${baseRoute}/migrate`, async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { extensions } = await c.req.json();
    for (const ext of extensions) {
      await kv.set(`${PREFIX}${ext.id}`, ext);
    }
    return c.json({ success: true, count: extensions.length });
  } catch (error) {
    console.error('Migration error:', error);
    return c.json({ error: 'Migration failed' }, 500);
  }
});

app.get(`${baseRoute}/status`, async (c) => {
  const initialized = await kv.get('system:initialized');
  return c.json({ initialized: !!initialized });
});
app.get('/status', (c) => c.redirect(`${baseRoute}/status`));

// Support and Forum Routes
const supportPost = async (c: any) => {
  try {
    const { email, subject, message } = await c.req.json();
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return c.json({ error: 'Only Gmail accounts are allowed' }, 400);
    }
    const id = crypto.randomUUID();
    const ticket = { 
      id, 
      email, 
      subject, 
      message, 
      created_at: new Date().toISOString() 
    };
    await kv.set(`support:${id}`, ticket);
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Support submission error:', error);
    return c.json({ error: 'Failed to submit support request' }, 500);
  }
};
app.post(`${baseRoute}/support`, supportPost);
app.post('/support', supportPost);

const supportGet = async (c: any) => {
  try {
    const tickets = await kv.getByPrefix('support:');
    return c.json(tickets.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return c.json({ error: 'Failed to fetch tickets' }, 500);
  }
};
app.get(`${baseRoute}/support`, supportGet);
app.get('/support', supportGet);

const supportReply = async (c: any) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized. Please login again.' }, 401);

  try {
    const { ticketId, reply } = await c.req.json();
    const ticket = await kv.get(`support:${ticketId}`);
    if (ticket) {
      ticket.reply = reply;
      ticket.replied_at = new Date().toISOString();
      await kv.set(`support:${ticketId}`, ticket);
      return c.json({ success: true });
    }
    return c.json({ error: 'Ticket not found' }, 404);
  } catch (error) {
    console.error('Reply submission error:', error);
    return c.json({ error: 'Failed to submit reply' }, 500);
  }
};
app.post(`${baseRoute}/support/reply`, supportReply);
app.post('/support/reply', supportReply);

const supportDelete = async (c: any) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized. Please login again.' }, 401);

  const id = c.req.param('id');
  try {
    await kv.del(`support:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return c.json({ error: 'Failed to delete ticket' }, 500);
  }
};
app.delete(`${baseRoute}/support/:id`, supportDelete);
app.delete('/support/:id', supportDelete);

Deno.serve(app.fetch);
