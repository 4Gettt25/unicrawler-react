// src/services/authService.js
import { supabase } from '../supabaseClient';

export const signUp = async (email, password) => {
	const { user, error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) throw error;
	return user;
};

export const signIn = async (email, password) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
};
