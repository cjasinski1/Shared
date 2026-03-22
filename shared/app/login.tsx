import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { ls } from '../styles/loginStyles';

export default function LoginScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleAuth() {
    if (!email || !password) { setError('Please enter your email and password'); return; }
    setLoading(true); setError(''); setMessage('');
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Check your email to confirm your account!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={ls.safe}>
      <KeyboardAvoidingView
        style={ls.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={ls.logo}>Shared</Text>
        <Text style={ls.tagline}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </Text>

        <Text style={ls.label}>Email</Text>
        <TextInput
          style={ls.input}
          placeholder="you@example.com"
          placeholderTextColor="#bbb"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={t => { setEmail(t); setError(''); }}
        />

        <Text style={ls.label}>Password</Text>
        <TextInput
          style={ls.input}
          placeholder="••••••••"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={t => { setPassword(t); setError(''); }}
        />

        {error ? <Text style={ls.errorText}>{error}</Text> : null}
        {message ? <Text style={[ls.errorText, { color: '#1D9E75' }]}>{message}</Text> : null}

        <TouchableOpacity
          style={ls.primaryBtn}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={ls.primaryBtnText}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Text>
          }
        </TouchableOpacity>

        <View style={ls.dividerRow}>
          <View style={ls.dividerLine} />
          <Text style={ls.dividerText}>or</Text>
          <View style={ls.dividerLine} />
        </View>

        <TouchableOpacity style={ls.googleBtn}>
          <Text style={ls.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={ls.toggle}>
          <Text style={ls.toggleText}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <TouchableOpacity onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage(''); }}>
            <Text style={ls.toggleLink}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}