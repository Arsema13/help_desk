import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.activity.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const manager1 = await prisma.user.create({
    data: {
      name: "Eden Hailu",
      email: "manager1@company.com",
      password: hashedPassword,
      role: "MANAGER",
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      name: "Meron Tekle",
      email: "manager2@company.com",
      password: hashedPassword,
      role: "MANAGER",
    },
  });

  const tech1 = await prisma.user.create({
    data: {
      name: "Tewodros Kassahun",
      email: "tech1@company.com",
      password: hashedPassword,
      role: "TECHNICAL",
    },
  });

  const tech2 = await prisma.user.create({
    data: {
      name: "Selamawit Assefa",
      email: "tech2@company.com",
      password: hashedPassword,
      role: "TECHNICAL",
    },
  });

  const tech3 = await prisma.user.create({
    data: {
      name: "Dawit Yohannes",
      email: "tech3@company.com",
      password: hashedPassword,
      role: "TECHNICAL",
    },
  });

  const emp1 = await prisma.user.create({
    data: {
      name: "Almaz Ayana",
      email: "emp1@company.com",
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  const emp2 = await prisma.user.create({
    data: {
      name: "Biniam Girma",
      email: "emp2@company.com",
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  const emp3 = await prisma.user.create({
    data: {
      name: "Kidi Berhanu",
      email: "emp3@company.com",
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  const allTechs = [tech1, tech2, tech3];

  const ticket1 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0001",
      title: "Unable to connect to company VPN",
      description:
        "Since this morning, I cannot connect to the company VPN from my home office. I have tried restarting my machine and the VPN client but nothing works. I need access urgently to attend a client meeting.",
      category: "IT_SUPPORT",
      priority: "HIGH",
      status: "RESOLVED",
      createdById: emp1.id,
      assignedToId: tech1.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0002",
      title: "Printer not working on floor 3",
      description:
        "The main printer on the third floor near the break room is showing a paper jam error even though there is no paper jammed. It has been like this for two days.",
      category: "FACILITIES",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdById: emp2.id,
      assignedToId: tech2.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0003",
      title: "Request for new laptop",
      description:
        "My current laptop is over 5 years old and is extremely slow. I would like to request a new laptop with at least 16GB RAM and an SSD drive for better performance.",
      category: "IT_SUPPORT",
      priority: "LOW",
      status: "OPEN",
      createdById: emp1.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0004",
      title: "Office AC not cooling properly",
      description:
        "The air conditioning in the east wing of the office is not cooling properly. The temperature is reading 28 degrees Celsius and it is affecting employee comfort and productivity.",
      category: "FACILITIES",
      priority: "HIGH",
      status: "ASSIGNED",
      createdById: emp2.id,
      assignedToId: tech3.id,
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0005",
      title: "Payroll discrepancy in March salary",
      description:
        "My March salary appears to be missing the overtime component. I worked 15 hours of overtime as approved by my manager but it was not reflected in my payslip.",
      category: "HR",
      priority: "HIGH",
      status: "OPEN",
      createdById: emp3.id,
    },
  });

  const ticket6 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0006",
      title: "Email account not syncing on mobile",
      description:
        "My company email stopped syncing on my iPhone since the latest iOS update. I can access webmail fine but push notifications and mobile sync are not working.",
      category: "IT_SUPPORT",
      priority: "MEDIUM",
      status: "CLOSED",
      createdById: emp1.id,
      assignedToId: tech1.id,
    },
  });

  const ticket7 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0007",
      title: "Meeting room projector bulb replacement",
      description:
        "The projector in meeting room B has a burned-out bulb and displays no image. We have important client presentations scheduled next week and need this fixed urgently.",
      category: "FACILITIES",
      priority: "MEDIUM",
      status: "RESOLVED",
      createdById: emp2.id,
      assignedToId: tech2.id,
    },
  });

  const ticket8 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0008",
      title: "Access request to HR database",
      description:
        "As the new HR coordinator, I need read and write access to the employee database system. My manager has approved this request. Please grant access to the HRMS portal.",
      category: "IT_SUPPORT",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdById: emp3.id,
      assignedToId: tech3.id,
    },
  });

  const ticket9 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0009",
      title: "Software license renewal for Adobe Suite",
      description:
        "Our team's Adobe Creative Cloud licenses are expiring next month. We need to renew 5 licenses for the design team. Please process the renewal and provide the updated activation codes.",
      category: "IT_SUPPORT",
      priority: "LOW",
      status: "OPEN",
      createdById: emp2.id,
    },
  });

  const ticket10 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0010",
      title: "Broken office chair ergonomic adjustment",
      description:
        "The height adjustment mechanism on my office chair is broken. The chair keeps sinking to its lowest position and I cannot lock it at the correct height.",
      category: "FACILITIES",
      priority: "LOW",
      status: "OPEN",
      createdById: emp1.id,
    },
  });

  const ticket11 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0011",
      title: "New employee onboarding - IT setup",
      description:
        "We have a new developer starting next Monday. Need a workstation with dual monitors, all development tools installed, and access to GitHub and internal repositories.",
      category: "IT_SUPPORT",
      priority: "HIGH",
      status: "ASSIGNED",
      createdById: emp3.id,
      assignedToId: tech1.id,
    },
  });

  const ticket12 = await prisma.ticket.create({
    data: {
      ticketNumber: "TKT-0012",
      title: "Company website SSL certificate expiring",
      description:
        "Our SSL certificate for the main company website is expiring in 5 days. This needs to be renewed before expiry to avoid security warnings for our customers.",
      category: "IT_SUPPORT",
      priority: "CRITICAL",
      status: "RESOLVED",
      createdById: manager1.id,
      assignedToId: tech3.id,
    },
  });

  const tickets = [
    ticket1, ticket2, ticket3, ticket4, ticket5,
    ticket6, ticket7, ticket8, ticket9, ticket10,
    ticket11, ticket12,
  ];

  for (const ticket of tickets) {
    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        userId: ticket.createdById,
        action: "STATUS_CHANGED",
        newValue: "OPEN",
      },
    });
  }

  await prisma.activity.create({
    data: {
      ticketId: ticket1.id,
      userId: manager1.id,
      action: "ASSIGNED",
      newValue: tech1.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket1.id,
      userId: tech1.id,
      action: "STATUS_CHANGED",
      oldValue: "IN_PROGRESS",
      newValue: "RESOLVED",
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket2.id,
      userId: manager2.id,
      action: "ASSIGNED",
      newValue: tech2.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket4.id,
      userId: manager1.id,
      action: "ASSIGNED",
      newValue: tech3.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket6.id,
      userId: manager2.id,
      action: "ASSIGNED",
      newValue: tech1.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket7.id,
      userId: manager1.id,
      action: "ASSIGNED",
      newValue: tech2.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket11.id,
      userId: manager2.id,
      action: "ASSIGNED",
      newValue: tech1.id,
    },
  });

  await prisma.activity.create({
    data: {
      ticketId: ticket12.id,
      userId: manager1.id,
      action: "ASSIGNED",
      newValue: tech3.id,
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: tech1.id,
      message:
        "I have investigated the VPN issue. It appears to be a DNS configuration problem. I am working on a fix.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: emp1.id,
      message:
        "Thank you for looking into this. Please let me know when it's resolved as I have a client meeting at 3 PM.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: tech1.id,
      message:
        "The VPN issue has been resolved. It was a routing table misconfiguration on the VPN server. You should be able to connect now.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: emp1.id,
      message: "Confirmed working. Thank you for the quick response!",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket2.id,
      userId: tech2.id,
      message:
        "I checked the printer on floor 3. The paper jam sensor is faulty. I have ordered a replacement part which should arrive in 2 days.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket3.id,
      userId: manager1.id,
      message:
        "Please provide specifications for the requested laptop so we can process the purchase order.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket6.id,
      userId: tech1.id,
      message:
        "The email sync issue was related to an outdated app configuration. I have updated the settings and it should work now.",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket6.id,
      userId: emp1.id,
      message: "Confirmed. Email is syncing correctly now. Thank you!",
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket12.id,
      userId: tech3.id,
      message:
        "The SSL certificate has been renewed and deployed. It will take up to 24 hours to propagate fully.",
    },
  });

  console.log("Seed completed successfully!");
  console.log("");
  console.log("Created users:");
  console.log("  Managers:      manager1@company.com, manager2@company.com");
  console.log("  Technical:     tech1@company.com, tech2@company.com, tech3@company.com");
  console.log("  Employees:     emp1@company.com, emp2@company.com, emp3@company.com");
  console.log("  Password:      password123 (all users)");
  console.log(`  Tickets:       ${tickets.length} created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
