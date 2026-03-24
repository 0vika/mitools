// TODO: set up email — add real RESEND_API_KEY and CONTACT_TO_EMAIL in .env, then test end-to-end
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// Simple in-memory rate limiter
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimit.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // CSRF: check origin
    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://mitools.dev', 'https://www.mitools.dev', 'http://localhost:4321'];
    if (!origin || !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden.' }), { status: 403 });
    }

    // Rate limiting
    const ip = clientAddress ?? 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Try again in a minute.' }), { status: 429 });
    }

    // Body size check
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 10_000) {
      return new Response(JSON.stringify({ error: 'Request too large.' }), { status: 413 });
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }

    // Sanitize and enforce length limits
    const cleanName = String(name).replace(/[\r\n]/g, '').trim().slice(0, 100);
    const cleanEmail = String(email).trim().slice(0, 254);
    const cleanMessage = String(message).trim().slice(0, 5000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format.' }), { status: 400 });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const toEmail = import.meta.env.CONTACT_TO_EMAIL;

    await resend.emails.send({
      from: 'mitools.dev <onboarding@resend.dev>',
      to: toEmail,
      subject: `Contact from ${cleanName} via mitools.dev`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Contact form error:', message);
    return new Response(JSON.stringify({ error: 'Failed to send message.' }), { status: 500 });
  }
};
