import { expect, test } from 'bun:test';
import { calculateSettlements } from '../components/split/DebtSolver';
import { SplitMember, SplitExpense, SplitShare } from '../types';

test('Debt Solver calculates basic split settlements correctly', () => {
  const members: SplitMember[] = [
    { id: 'm1', groupId: 'g1', name: 'Saya' },
    { id: 'm2', groupId: 'g1', name: 'Budi' },
    { id: 'm3', groupId: 'g1', name: 'Ani' }
  ];

  const expenses: SplitExpense[] = [
    { id: 'e1', groupId: 'g1', payerId: 'm1', title: 'Makan Malam', amount: 150000, createdAt: '' }
  ];

  const shares: SplitShare[] = [
    { id: 's1', expenseId: 'e1', memberId: 'm1', amount: 50000, settled: false },
    { id: 's2', expenseId: 'e1', memberId: 'm2', amount: 50000, settled: false },
    { id: 's3', expenseId: 'e1', memberId: 'm3', amount: 50000, settled: false }
  ];

  const settlements = calculateSettlements(members, expenses, shares);

  expect(settlements).toHaveLength(2);

  const budiSettle = settlements.find(s => s.from === 'm2');
  expect(budiSettle).toBeDefined();
  expect(budiSettle?.to).toBe('m1');
  expect(budiSettle?.amount).toBeCloseTo(50000);

  const aniSettle = settlements.find(s => s.from === 'm3');
  expect(aniSettle).toBeDefined();
  expect(aniSettle?.to).toBe('m1');
  expect(aniSettle?.amount).toBeCloseTo(50000);
});
