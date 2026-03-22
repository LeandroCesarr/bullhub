import { Queue, Worker } from "bullmq";

const connection = {
  host: "localhost",
  port: 6379,
};

// --- queues ---

const emailQueue = new Queue("email-queue", { connection });
const notificationQueue = new Queue("notification-queue", { connection });
const reportQueue = new Queue("report-generation", { connection });
const imageQueue = new Queue("image-processing", { connection });

const queues = [emailQueue, notificationQueue, reportQueue, imageQueue];

// --- workers ---

function createWorker(queueName: string, failRate = 0.1) {
  return new Worker(
    queueName,
    async (job) => {
      const duration = Math.random() * 3000 + 500;
      await new Promise((r) => setTimeout(r, duration));

      if (Math.random() < failRate) {
        throw new Error(`Simulated failure on ${queueName} job ${job.id}`);
      }

      return { processed: true, duration };
    },
    {
      connection,
      concurrency: 3,
      name: `worker-${queueName}`,
    },
  );
}

const workers = [
  createWorker("email-queue", 0.05),
  createWorker("notification-queue", 0.08),
  createWorker("report-generation", 0.15),
  createWorker("image-processing", 0.1),
];

// --- seed jobs ---

const emailJobs = [
  { name: "send-welcome-email", data: { userId: 1, email: "user@example.com" } },
  { name: "send-invoice-email", data: { userId: 2, invoiceId: "INV-001" } },
  { name: "send-reset-password", data: { userId: 3, token: "abc123" } },
  { name: "send-notification-email", data: { userId: 4, message: "Your order shipped" } },
];

const notificationJobs = [
  { name: "send-notification", data: { userId: 1, type: "push", message: "New message" } },
  { name: "send-notification", data: { userId: 2, type: "sms", message: "Your code: 1234" } },
  { name: "send-notification", data: { userId: 3, type: "push", message: "Order delivered" } },
];

const reportJobs = [
  { name: "generate-report", data: { reportId: "R-001", type: "monthly", userId: 1 } },
  { name: "generate-report", data: { reportId: "R-002", type: "weekly", userId: 2 } },
  { name: "export-csv", data: { entity: "orders", filters: { status: "completed" } } },
];

const imageJobs = [
  { name: "process-image", data: { imageId: "img-001", operations: ["resize", "compress"] } },
  { name: "process-image", data: { imageId: "img-002", operations: ["crop", "watermark"] } },
  { name: "generate-thumbnail", data: { imageId: "img-003", sizes: [64, 128, 256] } },
];

// --- scheduled jobs ---

async function seedScheduled() {
  await reportQueue.add(
    "daily-report",
    { type: "daily", scheduledFor: new Date().toISOString() },
    { delay: 60_000 * 5 }, // 5 min
  );

  await reportQueue.add(
    "weekly-report",
    { type: "weekly" },
    { delay: 60_000 * 30 }, // 30 min
  );

  await emailQueue.add(
    "send-digest-email",
    { type: "digest", users: [1, 2, 3] },
    { delay: 60_000 * 10 }, // 10 min
  );
}

// --- continuous seed ---

async function seedBatch() {
  const batch = [
    emailQueue.addBulk(emailJobs.map((j) => ({ ...j, opts: {} }))),
    notificationQueue.addBulk(notificationJobs.map((j) => ({ ...j, opts: {} }))),
    reportQueue.addBulk(reportJobs.map((j) => ({ ...j, opts: {} }))),
    imageQueue.addBulk(imageJobs.map((j) => ({ ...j, opts: {} }))),
  ];

  await Promise.all(batch);
  console.log("[seed] batch added");
}

async function main() {
  console.log("[seed] starting bullhub dev seed...");

  // seed inicial
  await seedBatch();
  await seedScheduled();

  // seed contínuo a cada 15s pra manter dados frescos na dash
  setInterval(async () => {
    await seedBatch();
  }, 15_000);

  console.log("[seed] workers running, adding jobs every 15s");
  console.log("[seed] queues:", queues.map((q) => q.name).join(", "));
}

// main().catch(console.error);

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n[seed] shutting down...");
  await Promise.all([...queues.map((q) => q.close()), ...workers.map((w) => w.close())]);
  process.exit(0);
});
