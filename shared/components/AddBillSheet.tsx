import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Switch, Keyboard, Modal, ScrollView,
} from 'react-native';
import { s } from '../styles/addBillStyles';
import { supabase } from '../lib/supabase';

const HOUSEHOLD_ID = '11111111-1111-1111-1111-111111111111';
const MEMBERS = ['JK', 'RM', 'SA', '+1'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onBillAdded: () => void;
};

export default function AddBillSheet({ visible, onClose, onBillAdded }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [paidBy, setPaidBy] = useState(MEMBERS[0]);
  const [recurring, setRecurring] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setName(''); setAmount(''); setDueDay('');
    setPaidBy(MEMBERS[0]); setRecurring(true); setError('');
  }

  function handleClose() { reset(); onClose(); }

  async function handleSave() {
    if (!name.trim()) { setError('Bill name is required'); return; }
    if (!amount || isNaN(Number(amount))) { setError('Enter a valid amount'); return; }
    if (!dueDay || isNaN(Number(dueDay)) || Number(dueDay) < 1 || Number(dueDay) > 31) {
      setError('Enter a valid due day (1–31)'); return;
    }
    setSaving(true);
    Keyboard.dismiss();
    const { error: dbError } = await supabase.from('bills').insert({
      household_id: HOUSEHOLD_ID,
      name: name.trim(),
      amount: Number(amount),
      due_day: Number(dueDay),
      paid_by: paidBy,
      is_paid: false,
      is_recurring: recurring,
    });
    setSaving(false);
    if (dbError) { setError(dbError.message); return; }
    reset();
    onClose();
    onBillAdded();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={s.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View style={s.sheet}>
        <View style={s.handle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Add a bill</Text>

          <Text style={s.label}>Bill name</Text>
          <TextInput
            style={s.input}
            placeholder="e.g. Netflix, Rent, Gas"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={t => { setName(t); setError(''); }}
          />

          <View style={s.row}>
            <View style={s.half}>
              <Text style={s.label}>Amount ($)</Text>
              <TextInput
                style={s.input}
                placeholder="0.00"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={t => { setAmount(t); setError(''); }}
              />
            </View>
            <View style={s.half}>
              <Text style={s.label}>Due day</Text>
              <TextInput
                style={s.input}
                placeholder="1–31"
                placeholderTextColor="#bbb"
                keyboardType="number-pad"
                value={dueDay}
                onChangeText={t => { setDueDay(t); setError(''); }}
              />
            </View>
          </View>

          <Text style={s.label}>Who pays</Text>
          <View style={s.memberRow}>
            {MEMBERS.map(m => (
              <TouchableOpacity
                key={m}
                style={[s.memberBtn, paidBy === m && s.memberBtnActive]}
                onPress={() => setPaidBy(m)}
              >
                <Text style={[s.memberText, paidBy === m && s.memberTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.switchRow}>
            <View>
              <Text style={s.label}>Recurring monthly</Text>
              <Text style={s.switchSub}>Repeats automatically each month</Text>
            </View>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: '#e0e0e0', true: '#1D9E75' }}
              thumbColor="#fff"
            />
          </View>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[s.saveBtn, saving && s.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={s.saveBtnText}>{saving ? 'Saving...' : 'Save bill'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}