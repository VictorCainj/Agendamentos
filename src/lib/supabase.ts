import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://rvrkdizvsqbgjspisoxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cmtkaXp2c3FiZ2pzcGlzb3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzAzMjgsImV4cCI6MjA2MjQ0NjMyOH0.1Efie73ZfW6mQlkXkTiJcfeQruDHzu1RJTYOCP4n52c';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 