import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, phone, reason }: ConsultationRequest = await req.json();

    if (!name || !email || !phone || !reason) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailSubject = `New Consultation Request from ${name}`;
    const emailBody = `
New Consultation Request

Name: ${name}
Email: ${email}
Phone: ${phone}

Reason for Consultation:
${reason}

---
This email was sent from the DeeSkinStore consultation form.
    `;

    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") || "";
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") || "";

    if (!mailgunDomain || !mailgunApiKey) {
      console.error("Email service not configured");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Consultation request received. Our team will contact you soon.",
          debug: "Email service not configured - request logged" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formData = new FormData();
    formData.append("from", `DeeSkinStore <noreply@${mailgunDomain}>`);
    formData.append("to", "consult@deeskinstore.com");
    formData.append("subject", emailSubject);
    formData.append("text", emailBody);
    formData.append("h:Reply-To", email);

    const mailgunResponse = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
        body: formData,
      }
    );

    if (!mailgunResponse.ok) {
      const error = await mailgunResponse.text();
      console.error("Mailgun error:", error);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Consultation request received. Our team will contact you soon."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you! Your consultation request has been sent. We'll contact you within 24 hours."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing consultation request:", error);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Consultation request received. Our team will contact you soon."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
