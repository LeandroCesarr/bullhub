import {useState} from 'react'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'
import {Activity, CheckCircle, Clock, RotateCcw, Server, TrendingUp, Users, XCircle,} from 'lucide-react'
import {QueueSelector} from "@/components/QueueSelector.tsx";
import {JobStateSelector} from "@/components/JobStateSelector.tsx";
import {JobStateEnum} from "@/enums/jobStateEnum.ts";
import { RedisInfo } from "@/components/RedisInfo";

// ─── types ────────────────────────────────────────────────────────────────────

type MockJob = {
  id: string
  name: string
  queue: string
  status: string
  time: string
}

type MockQueue = {
  name: string
  color: string
  ok: number
  pend: number
  fail: number
}

// ─── mock data ────────────────────────────────────────────────────────────────

const mockJobs: MockJob[] = [
  { id: 'job-001', name: 'send-welcome-email', queue: 'email-queue', status: 'completed', time: '5m ago' },
  { id: 'job-002', name: 'send-notification', queue: 'notification-queue', status: 'active', time: '1m ago' },
  { id: 'job-003', name: 'generate-report', queue: 'report-generation', status: 'failed', time: '10m ago' },
  { id: 'job-004', name: 'process-image', queue: 'image-processing', status: 'waiting', time: 'now' },
  { id: 'job-005', name: 'send-invoice-email', queue: 'email-queue', status: 'failed', time: '15m ago' },
  { id: 'job-006', name: 'send-digest-email', queue: 'email-queue', status: 'delayed', time: '30m ago' },
  { id: 'job-007', name: 'push-notification', queue: 'notification-queue', status: 'completed', time: '2m ago' },
  { id: 'job-008', name: 'export-csv', queue: 'report-generation', status: 'completed', time: '8m ago' },
]

const mockQueues: MockQueue[] = [
  { name: 'email-queue', color: 'var(--color-primary)', ok: 1250, pend: 50, fail: 23 },
  { name: 'notification-queue', color: 'var(--color-accent)', ok: 3420, pend: 101, fail: 8 },
  { name: 'report-generation', color: 'var(--color-status-warning)', ok: 890, pend: 26, fail: 15 },
  { name: 'image-processing', color: 'var(--color-status-pending)', ok: 2140, pend: 0, fail: 32 },
]

const chartData = Array.from({ length: 23 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  completed: [120,95,80,70,90,160,280,420,510,560,540,490,450,480,460,420,380,340,300,260,220,190,160][i],
  failed: [8,5,4,3,6,10,15,18,20,22,19,17,15,16,14,12,10,9,8,7,6,5,4][i],
}))

const statusDot: Record<string, string> = {
  completed: 'bg-status-success',
  failed: 'bg-status-error',
  active: 'bg-status-info shadow-[0_0_5px] shadow-status-info/60',
  waiting: 'bg-status-warning',
  delayed: 'bg-status-pending',
}

// ─── activity chart ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-xs font-mono">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="text-status-success">completed: {payload[0]?.value}</p>
        <p className="text-status-error">failed: {payload[1]?.value}</p>
      </div>
  )
}

function ActivityChart() {
  return (
      <div className="bg-card border border-border rounded-radius-md p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium">job activity</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">last 24 hours</p>
          </div>
          <div className="flex gap-4 text-[11px] text-muted-foreground">
            <span><span className="text-status-success">●</span> completed</span>
            <span><span className="text-status-error">●</span> failed</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260 / 0.5)" />
            <XAxis
                dataKey="hour"
                tick={{ fill: 'oklch(0.55 0 0)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                interval={3}
            />
            <YAxis
                tick={{ fill: 'oklch(0.55 0 0)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="completed" stroke="oklch(0.85 0.18 130)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="failed" stroke="oklch(0.65 0.2 25)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}

// ─── overview card ────────────────────────────────────────────────────────────

type OverviewItemProps = {
  icon: React.ReactNode
  value: string
  label: string
  variant: 'purple' | 'green' | 'blue' | 'amber'
}

const overviewVariants = {
  purple: 'bg-[oklch(0.22_0.06_280)] border-status-pending/20',
  green: 'bg-[oklch(0.19_0.05_145)] border-status-success/20',
  blue: 'bg-[oklch(0.19_0.04_220)] border-status-info/20',
  amber: 'bg-[oklch(0.19_0.05_85)] border-status-warning/20',
}

function OverviewItem({ icon, value, label, variant }: OverviewItemProps) {
  return (
      <div className={`rounded-md border p-4 flex flex-col gap-2 ${overviewVariants[variant]}`}>
        <div className="opacity-70">{icon}</div>
        <div className="text-xl font-semibold text-foreground tracking-tight">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
  )
}

function OverviewCard() {
  return (
      <div className="bg-card border border-border rounded-radius-md p-5">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">overview</p>
        <div className="grid grid-cols-2 gap-2">
          <OverviewItem icon={<Users size={18} className="text-status-pending" />} value="5" label="workers online" variant="purple" />
          <OverviewItem icon={<TrendingUp size={18} className="text-status-success" />} value="245" label="jobs/hour" variant="green" />
          <OverviewItem icon={<Clock size={18} className="text-status-info" />} value="51" label="delayed" variant="blue" />
          <OverviewItem icon={<Activity size={18} className="text-status-warning" />} value="5.7k" label="total processed" variant="amber" />
        </div>
      </div>
  )
}

// ─── stat cards ───────────────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ReactNode
  value: string
  label: string
  change?: string
  variant: 'success' | 'error' | 'info' | 'warning'
}

const statVariants = {
  success: 'bg-[oklch(0.16_0.04_145)] border-status-success/20 text-status-success',
  error: 'bg-[oklch(0.16_0.04_25)] border-status-error/20 text-status-error',
  info: 'bg-[oklch(0.16_0.03_220)] border-status-info/20 text-status-info',
  warning: 'bg-[oklch(0.16_0.04_85)] border-status-warning/20 text-status-warning',
}

function StatCard({ icon, value, label, change, variant }: StatCardProps) {
  return (
      <div className={`rounded-radius-md border p-5 flex flex-col gap-3 min-h-[120px] ${statVariants[variant]}`}>
        <div className="flex items-start justify-between">
          <div className="opacity-80">{icon}</div>
          {change && <span className="text-[11px] font-medium">{change}</span>}
        </div>
        <div>
          <div className="text-3xl font-semibold text-foreground tracking-tight">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </div>
  )
}

function StatCards() {
  return (
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<CheckCircle size={18} />} value="5.716" label="completed" change="+12%" variant="success" />
        <StatCard icon={<XCircle size={18} />} value="78" label="failed" change="-4%" variant="error" />
        <StatCard icon={<RotateCcw size={18} />} value="20" label="active" change="now" variant="info" />
        <StatCard icon={<Clock size={18} />} value="177" label="waiting" change="queued" variant="warning" />
      </div>
  )
}

// ─── recent jobs card ─────────────────────────────────────────────────────────

function RecentJobsCard() {
  const [activeTab, setActiveTab] = useState<JobStateEnum>(JobStateEnum.ACTIVE)

  return (
      <div className="bg-card border border-border rounded-radius-md p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-sm font-medium">recent jobs</p>
          <div className="flex items-center gap-2 flex-wrap">
            <QueueSelector />
            <JobStateSelector value={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {mockJobs.length === 0 ? (
            <p className="text-center text-muted-foreground text-xs py-8">no jobs found</p>
        ) : (
            <div>
              {mockJobs.map(job => (
                  <div
                      key={job.id}
                      className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-none hover:bg-muted/50 rounded px-1 cursor-pointer transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[job.status]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {job.name}
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    {job.queue}
                  </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{job.id}</div>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">{job.time}</span>
                  </div>
              ))}
            </div>
        )}
      </div>
  )
}

// ─── queues card ──────────────────────────────────────────────────────────────

function QueueBar({ ok, pend, fail }: { ok: number; pend: number; fail: number }) {
  const total = ok + pend + fail || 1
  return (
      <div className="h-[3px] rounded-full bg-border overflow-hidden flex gap-px">
        <div className="bg-status-success rounded-full" style={{ width: `${(ok / total) * 100}%` }} />
        <div className="bg-status-warning rounded-full" style={{ width: `${(pend / total) * 100}%` }} />
        <div className="bg-status-error rounded-full" style={{ width: `${(fail / total) * 100}%` }} />
      </div>
  )
}

function QueuesCard() {
  return (
      <div className="bg-card border border-border rounded-radius-md p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">queues</p>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
          {mockQueues.length} queues
        </span>
        </div>
        <div>
          {mockQueues.map(q => (
              <div key={q.name} className="py-2.5 border-b border-border last:border-none">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: q.color }} />
                  <span className="text-xs font-medium">{q.name}</span>
                </div>
                <div className="flex gap-3 text-[11px] mb-1.5">
                  <span className="text-status-success">{q.ok.toLocaleString()} ok</span>
                  <span className="text-status-warning">{q.pend} pend</span>
                  <span className="text-status-error">{q.fail} fail</span>
                </div>
                <QueueBar ok={q.ok} pend={q.pend} fail={q.fail} />
              </div>
          ))}
        </div>
      </div>
  )
}

// ─── dashboard page ───────────────────────────────────────────────────────────

export function Dashboard() {
  return (
      <div className="p-6 bg-background min-h-screen text-foreground font-mono flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <ActivityChart />
          </div>
          <OverviewCard />
          <RedisInfo />
        </div>

        <StatCards />

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <RecentJobsCard />
          </div>
          <QueuesCard />
        </div>
      </div>
  )
}