interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_FROM_NAME?: string;
}

type PagesContext = { request: Request; env: Env };

// Same-origin only: the form posts from this site, so no CORS headers are sent.
const json = (data: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const onRequestPost = async ({ request, env }: PagesContext) => {
  try {
    const body = await request.json() as { name?: string; email?: string; message?: string };
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) return json({ error: "Name, email, and message are required." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return json({ error: "Please enter a valid email address." }, 400);
    if (body.name.length > 200 || body.email.length > 320 || body.message.length > 5000) return json({ error: "The message is too long." }, 400);
    if (!env.RESEND_API_KEY) return json({ error: "Email service is not configured." }, 503);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${env.CONTACT_FROM_NAME ?? "Portfolio Contact"} <${env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
        to: [env.CONTACT_TO_EMAIL ?? "humzatmalak@gmail.com"],
        reply_to: body.email,
        subject: `New portfolio enquiry from ${body.name}`,
        text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
      }),
    });
    if (!response.ok) return json({ error: "The email service could not accept this message." }, 502);
    return json({ message: "Contact form submitted successfully." });
  } catch { return json({ error: "Invalid request." }, 400); }
};
