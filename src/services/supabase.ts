import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string, fullName: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: authData.user.id, email, full_name: fullName }]);

    if (profileError) throw profileError;
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function uploadScan(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('scans')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('scans')
    .getPublicUrl(fileName);

  const { data: scanData, error: scanError } = await supabase
    .from('scans')
    .insert([{ user_id: userId, image_url: publicUrl }])
    .select()
    .single();

  if (scanError) throw scanError;
  return scanData;
}

export async function saveScanResults(
  scanId: string,
  results: Array<{
    condition_name: string;
    severity: string;
    description: string;
    location: string;
  }>
) {
  const { data, error } = await supabase
    .from('scan_results')
    .insert(
      results.map(result => ({
        scan_id: scanId,
        ...result
      }))
    )
    .select();

  if (error) throw error;
  return data;
}

export async function getUserScans(userId: string) {
  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      scan_results (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getScanById(scanId: string) {
  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      scan_results (*)
    `)
    .eq('id', scanId)
    .single();

  if (error) throw error;
  return data;
}