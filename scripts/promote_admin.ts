
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://yzkjyiugkkuqycxitfst.supabase.co";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Find latest user
const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

if (error || !users || users.length === 0) {
    console.error("No users found:", error);
    Deno.exit(1);
}

const targetUser = users[0];
console.log(`Found user: ${targetUser.display_name} (${targetUser.id}) - Current Role: ${targetUser.role}`);

// Update to admin
const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin', is_verified: true })
    .eq('id', targetUser.id);

if (updateError) {
    console.error("Update failed:", updateError);
} else {
    console.log(`✅ Successfully promoted ${targetUser.display_name} to ADMIN!`);
}
