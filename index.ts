import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  webpush.setVapidDetails(
    Deno.env.get('VAPID_SUBJECT') || 'mailto:compi@example.com',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!,
  );

  const now = Date.now();

  async function push(rows: any[], body: (e: any) => string, tag: (e: any) => string, onOk: (e: any) => Promise<void>) {
    if (!rows.length) return 0;
    const users = [...new Set(rows.map((e: any) => e.user_id))];
    const { data: subs } = await admin.from('push_subs').select('endpoint,user_id,p256dh,auth').in('user_id', users);
    const byUser: Record<string, any[]> = {};
    (subs || []).forEach((s: any) => (byUser[s.user_id] ||= []).push(s));
    let sent = 0;
    for (const e of rows) {
      const list = byUser[e.user_id] || [];
      if (!list.length) continue;
      const payload = JSON.stringify({ title: 'Compi', body: body(e), tag: tag(e) });
      const res = await Promise.allSettled(
        list.map((s) => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)),
      );
      let ok = false;
      for (let i = 0; i < res.length; i++) {
        const r = res[i];
        if (r.status === 'fulfilled') ok = true;
        else {
          const code = (r.reason as any)?.statusCode;
          if (code === 404 || code === 410) await admin.from('push_subs').delete().eq('endpoint', list[i].endpoint);
        }
      }
      if (!ok) continue;
      sent++;
      await onOk(e);
    }
    return sent;
  }

  const { data: evs, error } = await admin
    .from('events')
    .select('id,user_id,title,at,repeat_rule')
    .eq('done', false)
    .eq('notified', false)
    .lte('at', new Date(now).toISOString())
    .gte('at', new Date(now - 6 * 3600_000).toISOString())
    .limit(200);
  if (error) return new Response(error.message, { status: 500 });

  const s1 = await push(
    (evs as any[]) || [],
    (e) => `Recordatorio: ${e.title}`,
    (e) => e.id,
    async (e) => {
      if (e.repeat_rule) {
        const step = e.repeat_rule === 'daily' ? 86400000 : 604800000;
        let at = new Date(e.at).getTime();
        while (at <= now) at += step;
        await admin.from('events').update({ at: new Date(at).toISOString(), notified: false }).eq('id', e.id);
      } else {
        await admin.from('events').update({ notified: true }).eq('id', e.id);
      }
    },
  );

  let s2 = 0;
  try {
    const { data: fu, error: fe } = await admin
      .from('events')
      .select('id,user_id,title,at')
      .eq('notified', true)
      .eq('fu_sent', false)
      .eq('repeat_rule', '')
      .lte('at', new Date(now - 21 * 60_000).toISOString())
      .gte('at', new Date(now - 6 * 3600_000).toISOString())
      .limit(200);
    if (!fe && fu?.length) {
      s2 = await push(
        fu as any[],
        (e) => `¿Cómo te fue con «${e.title}»?`,
        (e) => 'fu-' + e.id,
        async (e) => { await admin.from('events').update({ fu_sent: true }).eq('id', e.id); },
      );
    }
  } catch (_) { /* columna fu_sent aún no creada */ }

  return new Response(String(s1 + s2));
});
