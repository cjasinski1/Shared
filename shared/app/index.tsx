import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { styles } from '../styles/homeStyles';
import AddBillSheet from '../components/AddBillSheet';

const HOUSEHOLD_ID = '11111111-1111-1111-1111-111111111111';
const MEMBERS = ['JK', 'RM', 'SA', '+1'];
const AVATAR_COLORS = [
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#FAECE7', text: '#712B13' },
];
const BILL_COLORS: Record<string, string> = {
  Rent: '#E1F5EE', Electricity: '#FAEEDA',
  Internet: '#EEEDFE', Gas: '#FAECE7',
  Water: '#E6F1FB', Default: '#F1EFE8',
};
const BILL_ICONS: Record<string, string> = {
  Rent: '⌂', Electricity: '⚡',
  Internet: '◎', Gas: '◈',
  Water: '◉', Default: '◆',
};

type Bill = {
  id: string;
  name: string;
  amount: number;
  due_day: number;
  paid_by: string;
  is_paid: boolean;
};

export default function HomeScreen() {
  const { session } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [householdName, setHouseholdName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function fetchData() {
    const [{ data: household }, { data: billsData }] = await Promise.all([
      supabase.from('households').select('name').eq('id', HOUSEHOLD_ID).single(),
      supabase.from('bills').select('*').eq('household_id', HOUSEHOLD_ID).order('due_day'),
    ]);
    if (household) setHouseholdName(household.name);
    if (billsData) setBills(billsData);
    setLoading(false);
    setRefreshing(false);
  }

  async function togglePaid(bill: Bill) {
    const newStatus = !bill.is_paid;
    setBills(prev => prev.map(b => b.id === bill.id ? { ...b, is_paid: newStatus } : b));
    await supabase.from('bills').update({ is_paid: newStatus }).eq('id', bill.id);
  }

  useEffect(() => { fetchData(); }, []);

  const total = bills.reduce((s, b) => s + b.amount, 0);
  const paid = bills.filter(b => b.is_paid).reduce((s, b) => s + b.amount, 0);
  const pending = total - paid;
  const each = MEMBERS.length > 0 ? Math.round(pending / MEMBERS.length) : 0;
  const progress = total > 0 ? Math.round((paid / total) * 100) : 0;
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor="#1D9E75"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>{householdName}</Text>
            <Text style={styles.subheading}>{monthLabel}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.avatarRow}>
              {MEMBERS.map((m, i) => (
                <View
                  key={m}
                  style={[
                    styles.avatar,
                    { backgroundColor: AVATAR_COLORS[i].bg, marginLeft: i === 0 ? 0 : -6 },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: AVATAR_COLORS[i].text }]}>{m}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => supabase.auth.signOut()}
              style={{ padding: 6 }}
            >
              <Text style={{ fontSize: 11, color: '#aaa' }}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryVal}>${total.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={[styles.summaryVal, styles.green]}>${paid.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Each owes</Text>
            <Text style={[styles.summaryVal, styles.amber]}>${each.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.sectionLabel}>THIS MONTH</Text>

        {bills.map(bill => {
          const iconBg = BILL_COLORS[bill.name] ?? BILL_COLORS.Default;
          const icon = BILL_ICONS[bill.name] ?? BILL_ICONS.Default;
          const perPerson = Math.round(bill.amount / MEMBERS.length);
          return (
            <TouchableOpacity
              key={bill.id}
              style={[styles.bill, bill.is_paid && styles.billPaid]}
              onPress={() => togglePaid(bill)}
              activeOpacity={0.7}
            >
              <View style={[styles.check, bill.is_paid && styles.checkDone]}>
                {bill.is_paid && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={[styles.billIcon, { backgroundColor: iconBg }]}>
                <Text style={styles.billIconText}>{icon}</Text>
              </View>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billMeta}>Due {bill.due_day} · {bill.paid_by} pays</Text>
              </View>
              <View style={styles.billRight}>
                <Text style={styles.billAmt}>${bill.amount.toLocaleString()}</Text>
                <Text style={bill.is_paid ? styles.stPaid : styles.stDue}>
                  {bill.is_paid ? 'Paid' : 'Due soon'}
                </Text>
                <Text style={styles.eachAmt}>${perPerson} each</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setSheetOpen(true)}
        >
          <Text style={styles.addBtnText}>+ Add a bill</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.nav}>
        <View style={styles.navItem}>
          <View style={styles.navDot} />
          <Text style={[styles.navLabel, styles.navActive]}>Home</Text>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>▦</Text>
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>≡</Text>
          <Text style={styles.navLabel}>Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>◎</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      <AddBillSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onBillAdded={fetchData}
      />
    </SafeAreaView>
  );
}