import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    const userExists = userData?.users?.some(u => u.email === email);

    if (!userExists) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ message: "If an account exists, a reset code has been sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in database
    const { error: insertError } = await supabase
      .from("password_reset_codes")
      .insert({
        email,
        code,
        used: false,
      });

    if (insertError) {
      console.error("Error storing reset code:", insertError);
      throw insertError;
    }

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: "Peak Flow Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Code",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Use the code below to reset it:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px; font-weight: bold;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    return new Response(
      JSON.stringify({ message: "If an account exists, a reset code has been sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-reset-code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
