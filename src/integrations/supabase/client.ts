// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kyxwnpnwibarzxamgkrr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5eHducG53aWJhcnp4YW1na3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTczNTksImV4cCI6MjA2NjE5MzM1OX0.tip0uzBs-yEhoqdsLGW_ikJEyW-Oj4qD2uAdIWuTN_k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);