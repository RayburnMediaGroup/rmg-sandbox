import { createClient } from "@supabase/supabase-js";

const url = "https://uhxqxdwxwogkyrhvegqh.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeHF4ZHd4d29na3lyaHZlZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzE1NzQsImV4cCI6MjEwMzk0NzU3NH0.-8XO6XU5tYmMxuCQ_RsgxJYm4nIOo_DOFbDKbuJmUPk";

export const supabase = createClient(url, key);
