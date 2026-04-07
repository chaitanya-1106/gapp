import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqzbpwhsvygpdiysozgk.supabase.co';
const supabaseKey = 'sb_publishable_lwj7QYcRlfpdRWapIdntyg_nzEfxU7L';

export const supabase = createClient(supabaseUrl, supabaseKey);
