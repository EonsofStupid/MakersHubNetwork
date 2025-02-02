import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: blob: 'unsafe-inline'; font-src * data: 'unsafe-inline';",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Applying security headers...');
    
    return new Response(
      JSON.stringify({ 
        message: 'Security headers applied',
        success: true 
      }), 
      {
        headers: {
          ...corsHeaders,
          ...securityHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in security-headers function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    );
  }
});