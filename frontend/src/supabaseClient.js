import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Check if the environment variables are set
if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('supabaseUrl and supabaseKey are required.');
}

// Export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
