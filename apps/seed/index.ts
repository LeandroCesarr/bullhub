import { Queue, Worker } from "bullmq";

const connection = { host: "localhost", port: 6379 };

// --- queues ---

const emailQueue = new Queue("email-queue", { connection });
const notificationQueue = new Queue("notification-queue", { connection });
const reportQueue = new Queue("report-generation", { connection });
const imageQueue = new Queue("image-processing", { connection });
const webhookQueue = new Queue("webhook-delivery", { connection });

const queues = [emailQueue, notificationQueue, reportQueue, imageQueue, webhookQueue];

// --- workers ---

function createWorker(queueName: string, failRate = 0.1) {
  return new Worker(
    queueName,
    async (job) => {
      const steps = Math.floor(Math.random() * 5) + 3;

      for (let i = 1; i <= steps; i++) {
        await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));
        await job.updateProgress(Math.floor((i / steps) * 100));
      }

      if (Math.random() < failRate) {
        throw new Error(`Simulated failure on ${queueName} — job ${job.id}`);
      }

      return { processed: true };
    },
    { connection, concurrency: 3 },
  );
}

const workers = [
  createWorker("email-queue", 0.1),
  createWorker("notification-queue", 0.15),
  createWorker("report-generation", 0.2),
  createWorker("image-processing", 0.1),
  createWorker("webhook-delivery", 0.25),
];

// --- job definitions ---

const emailJobs = [
  { name: "send-welcome-email", data: { userId: 1, email: "alice@example.com" } },
  { name: "send-invoice-email", data: { userId: 2, invoiceId: "INV-001" } },
  { name: "send-reset-password", data: { userId: 3, token: "abc123" } },
  { name: "send-notification-email", data: { userId: 4, message: "Your order shipped" } },
  { name: "send-digest-email", data: { users: [1, 2, 3, 4] } },
];

const notificationJobs = [
  { name: "send-push", data: { userId: 1, message: "New message received" } },
  { name: "send-sms", data: { userId: 2, phone: "+5511999999999", code: "1234" } },
  { name: "send-push", data: { userId: 3, message: "Order delivered" } },
  { name: "send-in-app", data: { userId: 4, type: "alert", message: "Payment failed" } },
];

const reportJobs = [
  { name: "generate-report", data: { reportId: "R-001", type: "monthly", userId: 1 } },
  { name: "generate-report", data: { reportId: "R-002", type: "weekly", userId: 2 } },
  { name: "export-csv", data: { entity: "orders", filters: { status: "completed" } } },
  { name: "export-pdf", data: { entity: "invoices", userId: 3 } },
];

const imageJobs = [
  { name: "process-image", data: { imageId: "img-001", operations: ["resize", "compress"] } },
  { name: "process-image", data: { imageId: "img-002", operations: ["crop", "watermark"] } },
  { name: "generate-thumbnail", data: { imageId: "img-003", sizes: [64, 128, 256] } },
  { name: "convert-format", data: { imageId: "img-004", from: "png", to: "webp" } },
];

const webhookJobs = [
  {
    name: "deliver-webhook",
    data: { url: "https://api.example.com/hooks/1", event: "order.created" },
  },
  {
    name: "deliver-webhook",
    data: { url: "https://api.example.com/hooks/2", event: "payment.received" },
  },
  {
    name: "deliver-webhook",
    data: { url: "https://api.example.com/hooks/3", event: "user.signup" },
  },
];

// --- seed por status ---

async function seedActive() {
  // jobs que vão ser processados imediatamente pelos workers
  await Promise.all([
    emailQueue.addBulk(emailJobs.map((j) => ({ ...j, opts: {} }))),
    notificationQueue.addBulk(notificationJobs.map((j) => ({ ...j, opts: {} }))),
    imageQueue.addBulk(imageJobs.map((j) => ({ ...j, opts: {} }))),
  ]);
  console.log("[seed] active/waiting jobs added");
}

async function seedDelayed() {
  await Promise.all([
    reportQueue.add("daily-report", { type: "daily" }, { delay: 60_000 * 5 }),
    reportQueue.add("weekly-report", { type: "weekly" }, { delay: 60_000 * 15 }),
    emailQueue.add("send-digest-email", { users: [1, 2, 3] }, { delay: 60_000 * 10 }),
    webhookQueue.add(
      "retry-webhook",
      { url: "https://api.example.com/hooks/4", event: "order.updated" },
      { delay: 60_000 * 2 },
    ),
    imageQueue.add("batch-resize", { folder: "uploads/2024" }, { delay: 60_000 * 20 }),
  ]);
  console.log("[seed] delayed jobs added");
}

async function seedFailed() {
  // adiciona jobs com worker desabilitado para garantir falha
  const tempWorker = new Worker(
    "report-generation",
    async (job) => {
      await new Promise((r) => setTimeout(r, 300));
      throw new Error(`Forced failure — ${job.name}`);
    },
    { connection, concurrency: 5 },
  );

  await reportQueue.addBulk(reportJobs.map((j) => ({ ...j, opts: {} })));

  await new Promise((r) => setTimeout(r, 5000));
  await tempWorker.close();
  console.log("[seed] failed jobs added");
}

async function seedPrioritized() {
  await Promise.all([
    emailQueue.add("send-critical-alert", { userId: 1, type: "critical" }, { priority: 1 }),
    emailQueue.add("send-urgent-invoice", { userId: 2, invoiceId: "INV-URGENT" }, { priority: 2 }),
    notificationQueue.add(
      "send-urgent-push",
      { userId: 3, message: "Action required" },
      { priority: 1 },
    ),
  ]);
  console.log("[seed] prioritized jobs added");
}

async function seedRepeatable() {
  await Promise.all([
    emailQueue.add("send-heartbeat-email", { type: "heartbeat" }, { repeat: { every: 30_000 } }),
    reportQueue.add("generate-live-report", { type: "live" }, { repeat: { every: 60_000 } }),
  ]);
  console.log("[seed] repeatable jobs added");
}

async function seedBatch() {
  await Promise.all([
    emailQueue.addBulk(emailJobs.map((j) => ({ ...j, opts: {} }))),
    notificationQueue.addBulk(notificationJobs.map((j) => ({ ...j, opts: {} }))),
    reportQueue.addBulk(reportJobs.map((j) => ({ ...j, opts: {} }))),
    imageQueue.addBulk(imageJobs.map((j) => ({ ...j, opts: {} }))),
    webhookQueue.addBulk(webhookJobs.map((j) => ({ ...j, opts: {} }))),
  ]);
  console.log("[seed] batch added");
}

async function main() {
  console.log("[seed] starting bullhub dev seed...");

  await seedActive();
  await seedDelayed();
  await seedPrioritized();
  await seedRepeatable();
  await seedFailed();

  setInterval(seedBatch, 15_000);

  console.log("[seed] workers running, adding jobs every 15s");
  console.log("[seed] queues:", queues.map((q) => q.name).join(", "));
}

main().catch(console.error);

process.on("SIGINT", async () => {
  console.log("\n[seed] shutting down...");
  await Promise.all([...queues.map((q) => q.close()), ...workers.map((w) => w.close())]);
  process.exit(0);
});
