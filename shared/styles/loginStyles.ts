import { StyleSheet } from 'react-native';

export const ls = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  logo: { fontSize: 32, fontWeight: '500', color: '#228B22', marginBottom: 6 },
  tagline: { fontSize: 14, color: '#888', marginBottom: 40 },
  label: { fontSize: 12, fontWeight: '500', color: '#555', marginBottom: 6 },
  input: { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 10, padding: 13, fontSize: 14, color: '#000', marginBottom: 14, backgroundColor: '#fafafa' },
  primaryBtn: { backgroundColor: '#1D9E75', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: '#fff', fontWeight: '500', fontSize: 15 },
  secondaryBtn: { borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: '#1D9E75', fontWeight: '500', fontSize: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#e0e0e0' },
  dividerText: { fontSize: 12, color: '#aaa', marginHorizontal: 12 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#ddd', borderRadius: 12, padding: 14, gap: 10 },
  googleBtnText: { fontSize: 14, fontWeight: '500', color: '#333' },
  errorText: { fontSize: 12, color: '#E24B4A', textAlign: 'center', marginBottom: 10 },
  toggle: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  toggleText: { fontSize: 13, color: '#888' },
  toggleLink: { fontSize: 13, color: '#1D9E75', fontWeight: '500' },
});