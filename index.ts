// Emails you whenever a new booking is inserted. Uses Resend (resend.com).
const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  const { record } = await req.json().catch(() => ({}));
  if (!record) return new Response("No record", { status: 400 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("FROM_EMAIL") ?? "CLENA <onboarding@resend.dev>",
      to: [Deno.env.get("NOTIFY_EMAIL")],
      reply_to: record.email,
      subject: `New booking: ${record.service} on ${record.preferred_date}`,
      html: `<h2>New CLENA booking</h2>
        <p><b>${esc(record.name)}</b><br>${esc(record.email)}<br>${esc(record.phone)}</p>
        <p>Service: ${esc(record.service)}<br>Date: ${esc(record.preferred_date)}<br>Estimate: $${esc(record.estimate)}</p>
        <p>Note: ${esc(record.note) || "none"}</p>`,
    }),
  });
  return new Response(await res.text(), { status: res.status });
});
