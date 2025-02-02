import { connect } from "https://deno.land/x/redis@v0.29.0/mod.ts";
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { host, port, password } = await req.json();
    
    console.log('Testing Redis connection with:', { host, port });

    const redis = await connect({
      hostname: host,
      port: parseInt(port),
      password: password || undefined,
      maxRetryCount: 3,
      retryInterval: 1000,
    });

    // Test connection with basic operations
    await redis.ping();
    await redis.set("test_key", "test_value");
    const testValue = await redis.get("test_key");
    await redis.del("test_key");
    
    console.log('Redis connection test successful:', { testValue });
    await redis.close();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Connection successful',
        testResult: { testValue } 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Redis connection error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message,
        error: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});