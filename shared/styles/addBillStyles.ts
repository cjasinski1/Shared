import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  handle: { width: 36, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '500', color: '#000', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '500', color: '#555', marginBottom: 6 },
  input: { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 14, color: '#000', marginBottom: 16, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  memberRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  memberBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 0.5, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fafafa' },
  memberBtnActive: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  memberText: { fontSize: 13, color: '#555', fontWeight: '500' },
  memberTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingVertical: 4 },
  switchSub: { fontSize: 11, color: '#aaa', marginTop: 1 },
  error: { fontSize: 12, color: '#E24B4A', marginBottom: 12, textAlign: 'center' },
  saveBtn: { backgroundColor: '#1D9E75', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '500', fontSize: 15 },
});