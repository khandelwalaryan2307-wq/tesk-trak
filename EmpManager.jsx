import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarRadiusAxis } from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const REWARDS_CATALOG = [
  { id: 1, name: "Amazon Gift Card", points: 500, icon: "🎁", category: "Gift Cards", value: "$25" },
  { id: 2, name: "Spotify Premium (3mo)", points: 300, icon: "🎵", category: "Subscriptions", value: "3 months" },
  { id: 3, name: "Extra PTO Day", points: 800, icon: "🌴", category: "Company Perks", value: "1 day" },
  { id: 4, name: "Lunch Voucher", points: 150, icon: "🍽️", category: "Food", value: "$15" },
  { id: 5, name: "Netflix Gift Card", points: 400, icon: "🎬", category: "Gift Cards", value: "$20" },
  { id: 6, name: "Work From Home Week", points: 600, icon: "🏠", category: "Company Perks", value: "1 week" },
  { id: 7, name: "Coffee Shop Voucher", points: 100, icon: "☕", category: "Food", value: "$10" },
  { id: 8, name: "Tech Gadget Voucher", points: 1200, icon: "💻", category: "Tech", value: "$75" },
];

const INITIAL_EMPLOYEES = [
  {
    id: 1, name: "Sophia Chen", role: "Senior Engineer", avatar: "SC", dept: "Engineering",
    password: "emp123",
    metrics: { taskCompletion: 94, productivity: 88, deadlinesMet: 96, qualityScore: 91, attendance: 98 },
    weeklyScores: [82, 85, 88, 91, 89, 93, 95],
    monthlyScores: [78, 82, 86, 91],
    points: 1250, transactions: [
      { id: 1, type: "earned", amount: 300, desc: "Weekly Top Performer", date: "2024-01-15" },
      { id: 2, type: "redeemed", amount: -150, desc: "Lunch Voucher", date: "2024-01-20" },
      { id: 3, type: "earned", amount: 500, desc: "Monthly #1 Bonus", date: "2024-02-01" },
    ],
    notifications: [
      { id: 1, msg: "🏆 You ranked #1 this week! 300 points added.", read: false, time: "2h ago" },
      { id: 2, msg: "✅ Monthly report generated. Check your insights!", read: false, time: "1d ago" },
    ]
  },
  {
    id: 2, name: "Marcus Rivera", role: "Product Manager", avatar: "MR", dept: "Product",
    password: "emp123",
    metrics: { taskCompletion: 89, productivity: 92, deadlinesMet: 85, qualityScore: 88, attendance: 95 },
    weeklyScores: [78, 80, 83, 87, 85, 89, 91],
    monthlyScores: [74, 79, 84, 88],
    points: 820, transactions: [
      { id: 1, type: "earned", amount: 200, desc: "Weekly Top 3", date: "2024-01-22" },
      { id: 2, type: "earned", amount: 300, desc: "Weekly Top 3", date: "2024-02-05" },
    ],
    notifications: [{ id: 1, msg: "🥈 You ranked #2 this month! 200 points added.", read: true, time: "3d ago" }]
  },
  {
    id: 3, name: "Aisha Patel", role: "UX Designer", avatar: "AP", dept: "Design",
    password: "emp123",
    metrics: { taskCompletion: 91, productivity: 86, deadlinesMet: 93, qualityScore: 95, attendance: 92 },
    weeklyScores: [80, 82, 84, 86, 88, 87, 90],
    monthlyScores: [76, 80, 85, 89],
    points: 670, transactions: [
      { id: 1, type: "earned", amount: 150, desc: "Weekly Top 3", date: "2024-01-28" },
      { id: 2, type: "redeemed", amount: -300, desc: "Spotify Premium", date: "2024-02-02" },
    ],
    notifications: []
  },
  {
    id: 4, name: "James Okonkwo", role: "Data Analyst", avatar: "JO", dept: "Analytics",
    password: "emp123",
    metrics: { taskCompletion: 87, productivity: 84, deadlinesMet: 90, qualityScore: 82, attendance: 97 },
    weeklyScores: [75, 77, 80, 82, 81, 83, 85],
    monthlyScores: [72, 76, 80, 84],
    points: 310, transactions: [
      { id: 1, type: "earned", amount: 100, desc: "Performance Bonus", date: "2024-02-10" },
    ],
    notifications: []
  },
  {
    id: 5, name: "Elena Vasquez", role: "Backend Developer", avatar: "EV", dept: "Engineering",
    password: "emp123",
    metrics: { taskCompletion: 82, productivity: 79, deadlinesMet: 88, qualityScore: 84, attendance: 90 },
    weeklyScores: [70, 73, 75, 78, 77, 80, 82],
    monthlyScores: [68, 72, 76, 81],
    points: 180, transactions: [],
    notifications: []
  },
  {
    id: 6, name: "Noah Kim", role: "DevOps Engineer", avatar: "NK", dept: "Infrastructure",
    password: "emp123",
    metrics: { taskCompletion: 79, productivity: 82, deadlinesMet: 83, qualityScore: 78, attendance: 94 },
    weeklyScores: [68, 70, 72, 74, 73, 76, 79],
    monthlyScores: [65, 69, 73, 78],
    points: 90, transactions: [],
    notifications: []
  },
];

const WEIGHTS = { taskCompletion: 0.25, productivity: 0.25, deadlinesMet: 0.20, qualityScore: 0.20, attendance: 0.10 };

// ─── AI ENGINE ─────────────────────────────────────────────────────────────────

function computeScore(metrics, weights = WEIGHTS) {
  return Math.round(
    metrics.taskCompletion * weights.taskCompletion +
    metrics.productivity * weights.productivity +
    metrics.deadlinesMet * weights.deadlinesMet +
    metrics.qualityScore * weights.qualityScore +
    metrics.attendance * weights.attendance
  );
}

function generateAIFeedback(employee, score) {
  const { metrics } = employee;
  const strengths = [];
  const improvements = [];
  if (metrics.taskCompletion >= 90) strengths.push("exceptional task completion rate");
  if (metrics.productivity >= 88) strengths.push("outstanding productivity levels");
  if (metrics.deadlinesMet >= 90) strengths.push("consistent deadline adherence");
  if (metrics.qualityScore >= 90) strengths.push("high-quality deliverables");
  if (metrics.attendance >= 95) strengths.push("exemplary attendance record");
  if (metrics.taskCompletion < 85) improvements.push("focus on completing assigned tasks more consistently");
  if (metrics.productivity < 82) improvements.push("explore productivity optimization strategies");
  if (metrics.deadlinesMet < 85) improvements.push("work on deadline management techniques");
  if (metrics.qualityScore < 82) improvements.push("invest time in quality review processes");
  const trend = score >= 88 ? "upward" : score >= 78 ? "stable" : "needs attention";
  const trendText = trend === "upward" ? "showing strong upward momentum" : trend === "stable" ? "maintaining consistent performance" : "presenting an opportunity for growth";
  return {
    summary: `${employee.name} is ${trendText} with an overall score of ${score}/100. ${strengths.length > 0 ? `Key strengths include ${strengths.slice(0, 2).join(" and ")}.` : ""} ${improvements.length > 0 ? `Recommended focus areas: ${improvements[0]}.` : "Keep up the excellent work!"}`,
    trend,
    strengths,
    improvements
  };
}

// ─── STYLES ────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #0a0d14;
    --surface: #111520;
    --surface2: #171d2e;
    --border: rgba(255,255,255,0.07);
    --text: #e8eaf0;
    --muted: #6b7280;
    --accent: #6c63ff;
    --accent2: #22d3ee;
    --gold: #f59e0b;
    --silver: #94a3b8;
    --bronze: #b45309;
    --green: #10b981;
    --red: #ef4444;
    --radius: 14px;
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .light {
    --bg: #f0f2f8;
    --surface: #ffffff;
    --surface2: #f7f8fc;
    --border: rgba(0,0,0,0.08);
    --text: #1a1d2e;
    --muted: #64748b;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  
  .app { display: flex; min-height: 100vh; }
  
  /* SIDEBAR */
  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 0; position: fixed; height: 100vh;
    z-index: 100; transition: all 0.3s;
  }
  .logo { padding: 0 20px 28px; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
  .logo span { font-size: 11px; font-family: 'DM Sans', sans-serif; -webkit-text-fill-color: var(--muted);
    font-weight: 400; display: block; letter-spacing: 1px; text-transform: uppercase; margin-top: -4px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 20px; cursor: pointer;
    border-radius: 0; transition: all 0.2s; font-size: 14px; font-weight: 500; color: var(--muted);
    border-left: 3px solid transparent; }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(108,99,255,0.08); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 20px; border-top: 1px solid var(--border); }
  .user-pill { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: white; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; }
  .user-role { font-size: 11px; color: var(--muted); }
  
  /* MAIN */
  .main { flex: 1; margin-left: 240px; padding: 32px; min-height: 100vh; background: var(--bg); }
  
  /* TOPBAR */
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; }
  .topbar-actions { display: flex; align-items: center; gap: 12px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all 0.2s; position: relative; }
  .icon-btn:hover { border-color: var(--accent); }
  .badge { position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; background: var(--red);
    border-radius: 50%; font-size: 9px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  
  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 24px; box-shadow: var(--shadow); }
  .card-sm { padding: 18px; }
  .grid { display: grid; gap: 20px; }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  
  /* STAT CARDS */
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content:''; position:absolute; top:0; right:0; width:80px; height:80px;
    border-radius: 0 var(--radius) 0 80px; opacity: 0.12; }
  .stat-card.purple::before { background: var(--accent); }
  .stat-card.cyan::before { background: var(--accent2); }
  .stat-card.gold::before { background: var(--gold); }
  .stat-card.green::before { background: var(--green); }
  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700; margin: 6px 0 4px; }
  .stat-sub { font-size: 12px; color: var(--green); }
  .stat-icon { position: absolute; top: 18px; right: 18px; font-size: 24px; opacity: 0.6; }
  
  /* LEADERBOARD */
  .lb-row { display: grid; grid-template-columns: 44px 1fr 80px 80px 60px; align-items: center;
    gap: 12px; padding: 12px 16px; border-radius: 10px; margin-bottom: 6px; transition: all 0.2s; }
  .lb-row:hover { background: var(--surface2); }
  .lb-row.top1 { background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
    border: 1px solid rgba(245,158,11,0.25); }
  .lb-row.top2 { background: linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.04));
    border: 1px solid rgba(148,163,184,0.2); }
  .lb-row.top3 { background: linear-gradient(135deg, rgba(180,83,9,0.12), rgba(180,83,9,0.04));
    border: 1px solid rgba(180,83,9,0.2); }
  .rank-badge { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px; }
  .rank-1 { background: linear-gradient(135deg, var(--gold), #d97706); color: white; }
  .rank-2 { background: linear-gradient(135deg, #94a3b8, #64748b); color: white; }
  .rank-3 { background: linear-gradient(135deg, #b45309, #92400e); color: white; }
  .rank-other { background: var(--surface2); color: var(--muted); }
  .lb-name { font-weight: 600; font-size: 14px; }
  .lb-role { font-size: 11px; color: var(--muted); }
  .lb-score { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; text-align: center; }
  .lb-trend { font-size: 12px; text-align: center; }
  .trend-up { color: var(--green); }
  .trend-down { color: var(--red); }
  .trend-flat { color: var(--muted); }
  .points-badge { font-size: 11px; font-weight: 600; color: var(--gold); background: rgba(245,158,11,0.12);
    padding: 3px 8px; border-radius: 20px; text-align: center; }
  
  /* METRIC BAR */
  .metric-row { margin-bottom: 14px; }
  .metric-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
  .metric-bar { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .metric-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
  
  /* BUTTON */
  .btn { padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), #8b5cf6); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  
  /* REWARD CARD */
  .reward-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; text-align: center; transition: all 0.25s; cursor: pointer; }
  .reward-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(108,99,255,0.15); }
  .reward-icon { font-size: 36px; margin-bottom: 10px; }
  .reward-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
  .reward-value { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
  .reward-cost { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--gold); font-size: 18px; }
  
  /* TAGS */
  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; }
  .tag-purple { background: rgba(108,99,255,0.15); color: var(--accent); }
  .tag-green { background: rgba(16,185,129,0.15); color: var(--green); }
  .tag-gold { background: rgba(245,158,11,0.15); color: var(--gold); }
  .tag-red { background: rgba(239,68,68,0.15); color: var(--red); }
  
  /* TABLE */
  .table { width: 100%; border-collapse: collapse; }
  .table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted);
    padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid var(--border); }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: var(--surface2); }
  
  /* LOGIN */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); background-image: radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.06) 0%, transparent 50%); }
  .login-card { width: 420px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 40px; box-shadow: 0 24px 80px rgba(0,0,0,0.4); }
  .login-logo { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; text-align: center;
    background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; margin-bottom: 6px; }
  .login-sub { text-align: center; font-size: 13px; color: var(--muted); margin-bottom: 28px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--muted); display: block; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; padding: 11px 14px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; font-size: 14px; color: var(--text); font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--accent); }
  .role-toggle { display: flex; background: var(--surface2); border-radius: 10px; padding: 4px; margin-bottom: 20px; }
  .role-btn { flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 13px;
    font-weight: 600; transition: all 0.2s; color: var(--muted); }
  .role-btn.active { background: var(--accent); color: white; }
  
  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; }
  
  /* NOTIFICATION PANEL */
  .notif-panel { position: absolute; top: 48px; right: 0; width: 320px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow); z-index: 200; overflow: hidden; }
  .notif-item { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .notif-item.unread { background: rgba(108,99,255,0.05); }
  .notif-time { font-size: 11px; color: var(--muted); margin-top: 3px; }
  
  /* AI INSIGHT */
  .ai-box { background: linear-gradient(135deg, rgba(108,99,255,0.1), rgba(34,211,238,0.05));
    border: 1px solid rgba(108,99,255,0.25); border-radius: var(--radius); padding: 18px; }
  .ai-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  
  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300;
    display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    padding: 32px; width: 480px; max-width: 90vw; box-shadow: 0 32px 80px rgba(0,0,0,0.5); }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 20px; }
  
  /* TOAST */
  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px; font-size: 13px; font-weight: 500; z-index: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px;
    animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform:translateY(0); } }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  
  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--surface2); padding: 4px; border-radius: 10px; margin-bottom: 20px; width: fit-content; }
  .tab { padding: 7px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;
    color: var(--muted); transition: all 0.2s; }
  .tab.active { background: var(--accent); color: white; }
  
  /* SCORE RING */
  .score-ring { position: relative; width: 100px; height: 100px; }
  .score-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-num { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
  .score-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  
  @media (max-width: 1100px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 700px) {
    .sidebar { width: 60px; }
    .main { margin-left: 60px; padding: 16px; }
    .nav-item span { display: none; }
    .logo span, .logo { padding: 0 10px 20px; font-size: 0; }
    .sidebar-footer .user-name, .sidebar-footer .user-role { display: none; }
    .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 100 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "#10b981" : score >= 75 ? "#6c63ff" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface2)" strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: size * 0.22, fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: size * 0.09, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>score</span>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }) {
  const barColor = color || (value >= 90 ? "#10b981" : value >= 75 ? "#6c63ff" : value >= 60 ? "#f59e0b" : "#ef4444");
  return (
    <div className="metric-row">
      <div className="metric-label"><span>{label}</span><span style={{ color: "var(--text)", fontWeight: 600 }}>{value}%</span></div>
      <div className="metric-bar"><div className="metric-fill" style={{ width: `${value}%`, background: barColor }} /></div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return <div className="toast">✅ {msg}<span style={{ cursor: "pointer", marginLeft: 8, color: "var(--muted)" }} onClick={onClose}>✕</span></div>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN = { email: "admin@empmanager.com", password: "admin123" };

  function handleLogin() {
    if (role === "admin") {
      if (email === ADMIN.email && password === ADMIN.password) {
        onLogin({ role: "admin", name: "System Admin", avatar: "SA" });
      } else setError("Invalid admin credentials. Try admin@empmanager.com / admin123");
    } else {
      const emp = INITIAL_EMPLOYEES.find(e => e.name.toLowerCase().replace(/\s/g, ".") + "@company.com" === email);
      if (emp && password === emp.password) {
        onLogin({ role: "employee", id: emp.id });
      } else setError("Invalid credentials. Try sophia.chen@company.com / emp123");
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">EmpManager</div>
        <div className="login-sub">AI-Powered Performance & Rewards Platform</div>
        <div className="role-toggle">
          <div className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>👑 Admin</div>
          <div className={`role-btn ${role === "employee" ? "active" : ""}`} onClick={() => setRole("employee")}>👤 Employee</div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={email} onChange={e => setEmail(e.target.value)}
            placeholder={role === "admin" ? "admin@empmanager.com" : "sophia.chen@company.com"} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder={role === "admin" ? "admin123" : "emp123"} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {error && <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>{error}</div>}
        <button className="btn btn-primary" style={{ width: "100%", padding: 13 }} onClick={handleLogin}>Sign In</button>
        <div style={{ marginTop: 16, fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.7 }}>
          Demo: <b>admin@empmanager.com</b> / admin123<br />or <b>sophia.chen@company.com</b> / emp123
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

function AdminDashboard({ employees, setEmployees, showToast }) {
  const [page, setPage] = useState("overview");
  const [dark, setDark] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [weightState, setWeightState] = useState({ ...WEIGHTS });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", role: "", dept: "" });

  const scored = employees.map(e => ({ ...e, score: computeScore(e.metrics, weightState) }))
    .sort((a, b) => b.score - a.score);

  const totalPoints = employees.reduce((s, e) => s + e.points, 0);
  const avgScore = Math.round(scored.reduce((s, e) => s + e.score, 0) / scored.length);

  function addEmployee() {
    if (!newEmp.name || !newEmp.role) return;
    const emp = {
      id: Date.now(), name: newEmp.name, role: newEmp.role, dept: newEmp.dept || "General",
      avatar: newEmp.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      password: "emp123",
      metrics: { taskCompletion: 75, productivity: 75, deadlinesMet: 75, qualityScore: 75, attendance: 90 },
      weeklyScores: [70, 72, 74, 75, 75, 75, 75],
      monthlyScores: [70, 73, 75, 75],
      points: 0, transactions: [], notifications: []
    };
    setEmployees(prev => [...prev, emp]);
    setShowAddModal(false);
    setNewEmp({ name: "", role: "", dept: "" });
    showToast(`${emp.name} added successfully`);
  }

  function removeEmployee(id) {
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast("Employee removed");
  }

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
    { id: "employees", icon: "👥", label: "Employees" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "scoring", icon: "⚙️", label: "AI Scoring" },
    { id: "rewards", icon: "🎁", label: "Rewards" },
  ];

  return (
    <div className={dark ? "" : "light"}>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">EmpManager<span>Admin Console</span></div>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="user-pill">
              <div className="avatar">SA</div>
              <div><div className="user-name">System Admin</div><div className="user-role">Administrator</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="page-title">{navItems.find(n => n.id === page)?.icon} {navItems.find(n => n.id === page)?.label}</div>
            <div className="topbar-actions">
              <div className="icon-btn" onClick={() => setDark(d => !d)} title="Toggle theme">{dark ? "☀️" : "🌙"}</div>
              <div className="icon-btn" style={{ position: "relative" }} onClick={() => setShowNotif(s => !s)}>
                🔔<div className="badge">3</div>
                {showNotif && (
                  <div className="notif-panel">
                    <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid var(--border)" }}>Notifications</div>
                    {["🏆 Weekly leaderboard updated", "👤 New employee added by system", "🎁 5 rewards redeemed this week"].map((n, i) => (
                      <div key={i} className="notif-item unread">{n}<div className="notif-time">{i + 1}h ago</div></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {page === "overview" && <AdminOverview scored={scored} avgScore={avgScore} totalPoints={totalPoints} employees={employees} />}
          {page === "leaderboard" && <Leaderboard scored={scored} />}
          {page === "employees" && <EmployeeList scored={scored} onRemove={removeEmployee} onAdd={() => setShowAddModal(true)} />}
          {page === "analytics" && <Analytics employees={employees} scored={scored} />}
          {page === "scoring" && <ScoringConfig weights={weightState} setWeights={setWeightState} scored={scored} showToast={showToast} />}
          {page === "rewards" && <AdminRewards employees={employees} />}
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Add New Employee</div>
            {["name", "role", "dept"].map(f => (
              <div className="form-group" key={f}>
                <label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input className="form-input" value={newEmp[f]} onChange={e => setNewEmp(p => ({ ...p, [f]: e.target.value }))}
                  placeholder={f === "name" ? "Full Name" : f === "role" ? "Job Title" : "Department"} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={addEmployee}>Add Employee</button>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOverview({ scored, avgScore, totalPoints, employees }) {
  const top3 = scored.slice(0, 3);
  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Employees", value: employees.length, icon: "👥", sub: "Active workforce", cls: "purple" },
          { label: "Avg Performance", value: `${avgScore}/100`, icon: "📊", sub: "Company average", cls: "cyan" },
          { label: "Points Distributed", value: totalPoints.toLocaleString(), icon: "⭐", sub: "Total rewards", cls: "gold" },
          { label: "Top Score", value: scored[0]?.score, icon: "🏆", sub: scored[0]?.name, cls: "green" },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub" style={{ color: "var(--muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-header"><div className="section-title">🏆 Top Performers</div></div>
          {top3.map((e, i) => {
            const fb = generateAIFeedback(e, e.score);
            return (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: ["linear-gradient(135deg,#f59e0b,#d97706)", "linear-gradient(135deg,#94a3b8,#64748b)", "linear-gradient(135deg,#b45309,#92400e)"][i], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "white" }}>{e.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.role}</div>
                </div>
                <ScoreRing score={e.score} size={52} />
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="section-header"><div className="section-title">📈 Score Distribution</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scored.map(e => ({ name: e.name.split(" ")[0], score: e.score }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="score" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ scored }) {
  const [tab, setTab] = useState("weekly");
  const CREDIT_AWARDS = [500, 300, 150];

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab === "weekly" ? "active" : ""}`} onClick={() => setTab("weekly")}>Weekly</div>
        <div className={`tab ${tab === "monthly" ? "active" : ""}`} onClick={() => setTab("monthly")}>Monthly</div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {scored.slice(0, 3).map((e, i) => {
          const medals = ["🥇", "🥈", "🥉"];
          const colors = ["#f59e0b", "#94a3b8", "#b45309"];
          return (
            <div key={e.id} className="card" style={{ textAlign: "center", borderColor: colors[i] + "44", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: colors[i] }} />
              <div style={{ fontSize: 32, marginBottom: 8 }}>{medals[i]}</div>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "white", margin: "0 auto 10px" }}>{e.avatar}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{e.role}</div>
              <ScoreRing score={e.score} size={72} />
              <div style={{ marginTop: 10 }} className="points-badge">+{CREDIT_AWARDS[i]} pts awarded ⭐</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">Full Rankings</div>
          <span className="tag tag-purple">Auto-Updated by AI</span>
        </div>
        <div style={{ display: "flex", padding: "0 16px 8px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          <span style={{ width: 44 }}>Rank</span>
          <span style={{ flex: 1 }}>Employee</span>
          <span style={{ width: 80, textAlign: "center" }}>Score</span>
          <span style={{ width: 80, textAlign: "center" }}>Trend</span>
          <span style={{ width: 60, textAlign: "center" }}>Points</span>
        </div>
        {scored.map((e, i) => {
          const prev = tab === "weekly" ? e.weeklyScores[e.weeklyScores.length - 2] : e.monthlyScores[e.monthlyScores.length - 2];
          const cur = tab === "weekly" ? e.weeklyScores[e.weeklyScores.length - 1] : e.monthlyScores[e.monthlyScores.length - 1];
          const diff = cur - prev;
          return (
            <div key={e.id} className={`lb-row ${i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : ""}`}>
              <div className={`rank-badge ${i < 3 ? `rank-${i + 1}` : "rank-other"}`}>{i + 1}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{e.avatar}</div>
                <div>
                  <div className="lb-name">{e.name}</div>
                  <div className="lb-role">{e.dept}</div>
                </div>
              </div>
              <div className="lb-score" style={{ color: i === 0 ? "var(--gold)" : i === 1 ? "var(--silver)" : i === 2 ? "#b45309" : "var(--text)" }}>{e.score}</div>
              <div className={`lb-trend ${diff > 0 ? "trend-up" : diff < 0 ? "trend-down" : "trend-flat"}`}>
                {diff > 0 ? `↑ +${diff}` : diff < 0 ? `↓ ${diff}` : "→ —"}
              </div>
              <div className="points-badge">{e.points.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmployeeList({ scored, onRemove, onAdd }) {
  const [search, setSearch] = useState("");
  const filtered = scored.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input className="form-input" placeholder="🔍 Search employees..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        <button className="btn btn-primary" onClick={onAdd}>+ Add Employee</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr><th>Employee</th><th>Department</th><th>Score</th><th>Trend</th><th>Points</th><th>AI Insight</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const fb = generateAIFeedback(e, e.score);
              return (
                <tr key={e.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{e.avatar}</div>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{e.role}</div></div>
                  </div></td>
                  <td><span className="tag tag-purple">{e.dept}</span></td>
                  <td><span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>{e.score}</span></td>
                  <td><span className={fb.trend === "upward" ? "tag tag-green" : fb.trend === "stable" ? "tag tag-purple" : "tag tag-red"}>{fb.trend}</span></td>
                  <td style={{ fontWeight: 600, color: "var(--gold)" }}>{e.points.toLocaleString()} ⭐</td>
                  <td style={{ maxWidth: 200, fontSize: 11, color: "var(--muted)" }}>{fb.summary.slice(0, 80)}…</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => onRemove(e.id)}>Remove</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Analytics({ employees, scored }) {
  const monthLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const chartData = monthLabels.map((w, i) => {
    const obj = { week: w };
    employees.forEach(e => { obj[e.name.split(" ")[0]] = e.weeklyScores[i + 3]; });
    return obj;
  });
  const COLORS = ["#6c63ff", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#a78bfa"];

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="section-header"><div className="section-title">📈 Weekly Performance Trends</div></div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
            {employees.map((e, i) => (
              <Line key={e.id} type="monotone" dataKey={e.name.split(" ")[0]} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>📊 Metric Breakdown (Top Performer)</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={[
              { m: "Task", v: scored[0]?.metrics.taskCompletion },
              { m: "Productivity", v: scored[0]?.metrics.productivity },
              { m: "Deadlines", v: scored[0]?.metrics.deadlinesMet },
              { m: "Quality", v: scored[0]?.metrics.qualityScore },
              { m: "Attendance", v: scored[0]?.metrics.attendance },
            ]}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="m" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="v" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>🏢 Department Averages</div>
          {["Engineering", "Product", "Design", "Analytics", "Infrastructure"].map(dept => {
            const emps = scored.filter(e => e.dept === dept);
            if (!emps.length) return null;
            const avg = Math.round(emps.reduce((s, e) => s + e.score, 0) / emps.length);
            return <MetricBar key={dept} label={dept} value={avg} />;
          })}
        </div>
      </div>
    </div>
  );
}

function ScoringConfig({ weights, setWeights, scored, showToast }) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  const labels = { taskCompletion: "Task Completion", productivity: "Productivity", deadlinesMet: "Deadlines Met", qualityScore: "Quality Score", attendance: "Attendance" };

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="section-title" style={{ marginBottom: 6 }}>⚙️ AI Scoring Weights</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Adjust how much each metric contributes to the overall performance score.</div>
        {Object.entries(weights).map(([k, v]) => (
          <div key={k} className="metric-row">
            <div className="metric-label"><span>{labels[k]}</span><span style={{ color: "var(--text)", fontWeight: 600 }}>{(v * 100).toFixed(0)}%</span></div>
            <input type="range" min={0} max={0.5} step={0.05} value={v}
              onChange={e => setWeights(p => ({ ...p, [k]: parseFloat(e.target.value) }))}
              style={{ width: "100%", accentColor: "var(--accent)" }} />
          </div>
        ))}
        <div style={{ padding: "10px 12px", background: total > 1.01 || total < 0.99 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", borderRadius: 8, fontSize: 12, color: total > 1.01 || total < 0.99 ? "var(--red)" : "var(--green)", marginTop: 8 }}>
          {total > 1.01 || total < 0.99 ? `⚠️ Weights sum to ${(total * 100).toFixed(0)}% — should be 100%` : `✅ Weights sum to 100%`}
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => showToast("Scoring weights updated & applied!")}>Save & Recompute</button>
      </div>
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>📊 Recomputed Scores</div>
        {scored.map((e, i) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < scored.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 20, textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>{i + 1}</div>
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{e.avatar}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{e.name}</div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{e.score}</div>
            <div className="metric-bar" style={{ width: 80, height: 5 }}><div className="metric-fill" style={{ width: `${e.score}%`, background: "var(--accent)" }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminRewards({ employees }) {
  const allTx = employees.flatMap(e => e.transactions.map(t => ({ ...t, empName: e.name })))
    .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>🎁 Reward Catalog</div>
        <div className="grid grid-2">
          {REWARDS_CATALOG.slice(0, 4).map(r => (
            <div key={r.id} style={{ padding: 14, background: "var(--surface2)", borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>{r.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.value}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, color: "var(--gold)", fontSize: 14 }}>{r.points} pts</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>📋 Recent Transactions</div>
        {allTx.length === 0 ? <div style={{ color: "var(--muted)", fontSize: 13 }}>No transactions yet.</div> : allTx.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < allTx.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: 18 }}>{t.type === "earned" ? "⭐" : "🎁"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.empName}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.desc}</div>
            </div>
            <div style={{ fontWeight: 700, color: t.amount > 0 ? "var(--green)" : "var(--red)", fontSize: 14 }}>
              {t.amount > 0 ? "+" : ""}{t.amount}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EMPLOYEE DASHBOARD ───────────────────────────────────────────────────────

function EmployeeDashboard({ employee, allEmployees, setEmployees, showToast }) {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  const scored = allEmployees.map(e => ({ ...e, score: computeScore(e.metrics) })).sort((a, b) => b.score - a.score);
  const myData = scored.find(e => e.id === employee.id);
  const myRank = scored.findIndex(e => e.id === employee.id) + 1;
  const feedback = generateAIFeedback(myData, myData.score);
  const unread = myData.notifications.filter(n => !n.read).length;

  function redeemReward(reward) {
    if (myData.points < reward.points) { showToast("Insufficient points!"); return; }
    setEmployees(prev => prev.map(e => {
      if (e.id !== employee.id) return e;
      return {
        ...e, points: e.points - reward.points,
        transactions: [...e.transactions, { id: Date.now(), type: "redeemed", amount: -reward.points, desc: reward.name, date: new Date().toISOString().slice(0, 10) }],
        notifications: [...e.notifications, { id: Date.now(), msg: `🎁 You redeemed: ${reward.name} (−${reward.points} pts)`, read: false, time: "just now" }]
      };
    }));
    showToast(`${reward.name} redeemed! −${reward.points} points`);
  }

  const navItems = [
    { id: "dashboard", icon: "📊", label: "My Dashboard" },
    { id: "performance", icon: "📈", label: "Performance" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
    { id: "rewards", icon: "🎁", label: "Rewards" },
    { id: "history", icon: "📋", label: "History" },
  ];

  return (
    <div className={dark ? "" : "light"}>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">EmpManager<span>Employee Portal</span></div>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="user-pill">
              <div className="avatar">{myData.avatar}</div>
              <div><div className="user-name">{myData.name.split(" ")[0]}</div><div className="user-role">{myData.role}</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div><div className="page-title">{navItems.find(n => n.id === page)?.icon} {navItems.find(n => n.id === page)?.label}</div></div>
            <div className="topbar-actions">
              <div className="icon-btn" onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</div>
              <div className="icon-btn" style={{ position: "relative" }} onClick={() => setShowNotif(s => !s)}>
                🔔{unread > 0 && <div className="badge">{unread}</div>}
                {showNotif && (
                  <div className="notif-panel">
                    <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid var(--border)" }}>Notifications</div>
                    {myData.notifications.length === 0
                      ? <div style={{ padding: "16px", fontSize: 13, color: "var(--muted)" }}>No notifications</div>
                      : myData.notifications.map((n, i) => (
                        <div key={i} className={`notif-item ${n.read ? "" : "unread"}`}>{n.msg}<div className="notif-time">{n.time}</div></div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {page === "dashboard" && <EmployeeOverview myData={myData} myRank={myRank} feedback={feedback} total={allEmployees.length} />}
          {page === "performance" && <EmployeePerformance myData={myData} feedback={feedback} />}
          {page === "leaderboard" && <Leaderboard scored={scored} />}
          {page === "rewards" && <RewardsPage myData={myData} onRedeem={redeemReward} />}
          {page === "history" && <TransactionHistory myData={myData} />}
        </main>
      </div>
    </div>
  );
}

function EmployeeOverview({ myData, myRank, feedback, total }) {
  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Your Score", value: myData.score, icon: "⭐", cls: "purple" },
          { label: "Current Rank", value: `#${myRank} / ${total}`, icon: "🏆", cls: "gold" },
          { label: "Credit Points", value: myData.points.toLocaleString(), icon: "💎", cls: "cyan" },
          { label: "Tasks Completed", value: `${myData.metrics.taskCompletion}%`, icon: "✅", cls: "green" },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Your Performance Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <ScoreRing score={myData.score} size={120} />
            <div style={{ flex: 1 }}>
              {Object.entries(myData.metrics).map(([k, v]) => {
                const labels = { taskCompletion: "Task Completion", productivity: "Productivity", deadlinesMet: "Deadlines Met", qualityScore: "Quality Score", attendance: "Attendance" };
                return <MetricBar key={k} label={labels[k]} value={v} />;
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="ai-box" style={{ marginBottom: 16 }}>
            <div className="ai-label">🤖 AI Performance Insight</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text)" }}>{feedback.summary}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {feedback.strengths.slice(0, 2).map((s, i) => <span key={i} className="tag tag-green">✓ {s.split(" ").slice(-2).join(" ")}</span>)}
              {feedback.improvements.slice(0, 1).map((s, i) => <span key={i} className="tag tag-gold">→ {s.split(" ").slice(0, 3).join(" ")}</span>)}
            </div>
          </div>
          <div className="card card-sm">
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Weekly Trend</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={myData.weeklyScores.map((v, i) => ({ w: `W${i + 1}`, v }))}>
                <Line type="monotone" dataKey="v" stroke="var(--accent)" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeePerformance({ myData, feedback }) {
  const weeklyData = myData.weeklyScores.map((v, i) => ({ week: `Week ${i + 1}`, score: v }));
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>📈 Weekly Score History</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={3} dot={{ fill: "var(--accent)", strokeWidth: 0, r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>📊 Metric Details</div>
          {Object.entries(myData.metrics).map(([k, v]) => {
            const labels = { taskCompletion: "Task Completion", productivity: "Productivity", deadlinesMet: "Deadlines Met", qualityScore: "Quality Score", attendance: "Attendance" };
            return <MetricBar key={k} label={labels[k]} value={v} />;
          })}
        </div>
        <div>
          <div className="ai-box">
            <div className="ai-label">🤖 AI Detailed Analysis</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{feedback.summary}</div>
            {feedback.strengths.length > 0 && <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>💪 Strengths</div>
              {feedback.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, padding: "3px 0", color: "var(--text)" }}>✓ {s}</div>)}
            </>}
            {feedback.improvements.length > 0 && <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", marginTop: 10, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>🎯 Focus Areas</div>
              {feedback.improvements.map((s, i) => <div key={i} style={{ fontSize: 12, padding: "3px 0", color: "var(--text)" }}>→ {s}</div>)}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardsPage({ myData, onRedeem }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Gift Cards", "Subscriptions", "Company Perks", "Food", "Tech"];
  const filtered = REWARDS_CATALOG.filter(r => filter === "All" || r.category === filter);

  return (
    <div>
      <div className="card card-sm" style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Your Balance</div>
          <div style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, color: "var(--gold)" }}>⭐ {myData.points.toLocaleString()} pts</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Redeem your hard-earned points for great rewards!</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-outline"}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="grid grid-3">
        {filtered.map(r => {
          const canAfford = myData.points >= r.points;
          return (
            <div key={r.id} className="reward-card" style={{ opacity: canAfford ? 1 : 0.6 }}>
              <div className="reward-icon">{r.icon}</div>
              <div className="reward-name">{r.name}</div>
              <div className="reward-value">{r.category} · {r.value}</div>
              <div className="reward-cost">{r.points} pts</div>
              <button className={`btn btn-sm ${canAfford ? "btn-primary" : "btn-outline"}`}
                style={{ marginTop: 12, width: "100%" }}
                onClick={() => canAfford && onRedeem(r)}
                disabled={!canAfford}>
                {canAfford ? "Redeem Now" : "Not Enough Points"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionHistory({ myData }) {
  return (
    <div className="card">
      <div className="section-title" style={{ marginBottom: 20 }}>📋 Transaction History</div>
      {myData.transactions.length === 0
        ? <div style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: 32 }}>No transactions yet. Earn points by being a top performer!</div>
        : myData.transactions.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < myData.transactions.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: t.amount > 0 ? "rgba(16,185,129,0.1)" : "rgba(108,99,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.type === "earned" ? "⭐" : "🎁"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.desc}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.date}</div>
            </div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, color: t.amount > 0 ? "var(--green)" : "var(--red)" }}>
              {t.amount > 0 ? "+" : ""}{t.amount} pts
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  if (!user) return (
    <>
      <style>{styles}</style>
      <Login onLogin={setUser} />
    </>
  );

  if (user.role === "admin") return (
    <>
      <AdminDashboard employees={employees} setEmployees={setEmployees} showToast={showToast} />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );

  const empData = employees.find(e => e.id === user.id);
  return (
    <>
      <EmployeeDashboard employee={user} allEmployees={employees} setEmployees={setEmployees} showToast={showToast} />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}
