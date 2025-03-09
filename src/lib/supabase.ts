import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveReceipt = async (data: any) => {
  try {
    const { category, data: receiptData } = data;
    const table = category.toLowerCase() === 'meals' ? 'meals_receipts' : 'accommodation_receipts';
    
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data: result, error } = await supabase
      .from(table)
      .insert([{
        date_recu: receiptData.date_recu,
        items_purchased: receiptData.items_purchased,
        total_amount: receiptData.total_amount,
        devise: receiptData.devise,
        company: receiptData.company,
        user_id: userData.user.id // Add user_id to link the receipt to the user
      }])
      .select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error saving receipt:', error);
    throw error;
  }
};

export const getReceipts = async (category: string) => {
  try {
    const table = category.toLowerCase() === 'meals' ? 'meals_receipts' : 'accommodation_receipts';
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting receipts:', error);
    throw error;
  }
};

// Add authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};