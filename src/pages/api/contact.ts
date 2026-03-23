import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format.' }), { status: 400 });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const toEmail = import.meta.env.CONTACT_TO_EMAIL;

    await resend.emails.send({
      from: 'mitools.dev <onboarding@resend.dev>',
      to: toEmail,
      subject: `Contact from ${name} via mitools.dev`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message.' }), { status: 500 });
  }
};
