import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Copy, Check, Sparkles } from 'lucide-react';
import {
  getProfile,
  getTransactions,
  getCategories,
  getSavingGoals,
  getBills,
  getSplitGroups,
  getSplitMembers,
  getSplitExpenses,
  getSplitShares
} from '../../utils/storage';

export const AIExport: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const generateMarkdownSummary = (): string => {
    const profile = getProfile();
    const currency = profile.currency || 'Rp';
    const transactions = getTransactions();
    const categories = getCategories();
    const goals = getSavingGoals();
    const bills = getBills();
    const groups = getSplitGroups();
    const members = getSplitMembers();
    const expenses = getSplitExpenses();
    const shares = getSplitShares();

    // 1. Balance summary calculations
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    // 2. Monthly details
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    let md = `# FINANCIAL DATA EVALUATION SUMMARY\n`;
    md += `Generated on: ${new Date().toISOString()}\n`;
    md += `User Profile Name: ${profile.name}\n`;
    md += `Base Currency: ${currency}\n\n`;

    md += `## 1. SUMMARY BALANCE & OVERVIEW\n`;
    md += `- **Total Balance**: ${currency} ${totalBalance.toLocaleString('id-ID')}\n`;
    md += `- **All-time Income**: ${currency} ${totalIncome.toLocaleString('id-ID')}\n`;
    md += `- **All-time Expense**: ${currency} ${totalExpense.toLocaleString('id-ID')}\n`;
    md += `- **Current Month's Income**: ${currency} ${monthlyIncome.toLocaleString('id-ID')}\n`;
    md += `- **Current Month's Expense**: ${currency} ${monthlyExpense.toLocaleString('id-ID')}\n\n`;

    md += `## 2. TRANSACTIONS LIST (Last 50)\n`;
    if (transactions.length === 0) {
      md += `*No transactions recorded.*\n\n`;
    } else {
      md += `| Date | Type | Category | Amount | Note |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- |\n`;
      const sortedTxs = [...transactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50);

      sortedTxs.forEach(t => {
        const catName = categories.find(c => c.id === t.categoryId)?.name || 'Unknown';
        const formattedDate = new Date(t.createdAt).toISOString().split('T')[0];
        md += `| ${formattedDate} | ${t.type.toUpperCase()} | ${catName} | ${currency} ${t.amount.toLocaleString('id-ID')} | ${t.note || '-'} |\n`;
      });
      md += `\n`;
    }

    md += `## 3. SAVINGS GOALS\n`;
    if (goals.length === 0) {
      md += `*No saving goals recorded.*\n\n`;
    } else {
      md += `| Goal Name | Target Amount | Current Savings | Progress % | Target Date | Note |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      goals.forEach(g => {
        const pct = g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(1) : '0.0';
        md += `| ${g.name} | ${currency} ${g.targetAmount.toLocaleString('id-ID')} | ${currency} ${g.currentAmount.toLocaleString('id-ID')} | ${pct}% | ${g.deadline || '-'} | ${g.note || '-'} |\n`;
      });
      md += `\n`;
    }

    md += `## 4. BILLS REMINDER\n`;
    if (bills.length === 0) {
      md += `*No bills recorded.*\n\n`;
    } else {
      md += `| Title | Amount | Due Date | Repeat | Paid Status | Note |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      bills.forEach(b => {
        md += `| ${b.title} | ${currency} ${b.amount.toLocaleString('id-ID')} | ${b.dueDate} | ${b.repeat} | ${b.paid ? 'PAID' : 'UNPAID'} | ${b.note || '-'} |\n`;
      });
      md += `\n`;
    }

    md += `## 5. ACTIVE SPLIT BILLS (SHARED GROUPS)\n`;
    if (groups.length === 0) {
      md += `*No split groups recorded.*\n\n`;
    } else {
      groups.forEach(g => {
        md += `### Group: ${g.name}\n`;
        md += `Description: ${g.description || '-'}\n`;
        const grpMembers = members.filter(m => m.groupId === g.id);
        md += `Members: ${grpMembers.map(m => m.name).join(', ')}\n\n`;

        const grpExpenses = expenses.filter(e => e.groupId === g.id);
        md += `#### Expenses recorded under group:\n`;
        if (grpExpenses.length === 0) {
          md += `*No expenses added.*\n\n`;
        } else {
          md += `| Title | Paid By | Amount | Date |\n`;
          md += `| :--- | :--- | :--- | :--- |\n`;
          grpExpenses.forEach(e => {
            const payer = grpMembers.find(m => m.id === e.payerId)?.name || 'Unknown';
            const formattedDate = new Date(e.createdAt).toISOString().split('T')[0];
            md += `| ${e.title} | ${payer} | ${currency} ${e.amount.toLocaleString('id-ID')} | ${formattedDate} |\n`;
          });
          md += `\n`;
        }
      });
    }

    md += `## INSTRUCTIONS FOR AI EVALUATOR:\n`;
    md += `1. Analyze the user's monthly and all-time financial health, spending habits, and savings progress.\n`;
    md += `2. Identify potential issues (e.g., unpaid bills, high expense-to-income ratio, sluggish progress towards saving goals).\n`;
    md += `3. Provide constructive, actionable, and specific recommendations on budgeting, cutting expenses, and better managing shared split bills.\n`;
    md += `4. Format your feedback clearly with readable bullet points and highlight critical attention points.\n`;

    return md;
  };

  const handleCopy = () => {
    try {
      const textToCopy = generateMarkdownSummary();
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          // Fallback if Clipboard API fails
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        });
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-black shrink-0" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">Ekspor AI Stats (AI Evaluator)</span>
      </div>

      <p className="text-xs text-gray-500 font-medium">
        Salin statistik lengkap data keuangan Anda dalam format terstruktur yang ramah kecerdasan buatan (AI) untuk dievaluasi secara instan.
      </p>

      <div className="pt-1">
        <Button
          type="button"
          variant="primary"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 text-xs w-full"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-green-600">✓ Data AI Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 shrink-0" />
              Salin Data Stats AI
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
