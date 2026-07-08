const Department = require("./department.model");

const dummyDepartments = [
  { "name": "Engineering", "code": "ENG", "description": "Responsible for core software engineering, application architecture, technical infrastructure maintenance, and developer platform tooling." },
  { "name": "Human Resources", "code": "HR", "description": "Manages talent acquisition, onboarding, employee relations, corporate benefits systems, payroll compliance, and workplace culture initiatives." },
  { "name": "Product Management", "code": "PROD", "description": "Drives product strategy, defines feature roadmaps, conducts user research analytics, and aligns technical execution with business objectives." },
  { "name": "Marketing", "code": "MKT", "description": "Executes digital advertising, search engine optimization, content creation, social media presence, and global brand positioning strategies." },
  { "name": "Sales & Accounts", "code": "SALES", "description": "Identifies inbound pipeline leads, closes enterprise client agreements, handles contract negotiations, and drives global revenue growth." },
  { "name": "Customer Success", "code": "CS", "description": "Ensures post-sale retention, handles product training support ticket loops, minimizes customer churn metrics, and drives account upgrades." },
  { "name": "Finance & Accounting", "code": "FIN", "description": "Oversees corporate budgeting accounts, financial forecasting, quarterly tax auditing compliance, expense reporting, and book balancing." },
  { "name": "Legal & Compliance", "code": "LEGAL", "description": "Reviews corporate software licenses, draft customer data service privacy terms, protects intellectual property, and minimizes systemic compliance risks." },
  { "name": "Data Analytics & AI", "code": "DATA", "description": "Builds business intelligence visualization charts, manages analytical pipelines, develops machine learning models, and monitors company data warehouses." },
  { "name": "Cybersecurity & IT", "code": "SEC", "description": "Secures enterprise infrastructure, monitors unauthorized network intrusion vulnerabilities, coordinates firewalls, and provisions corporate workstations." },
  { "name": "Design & UX", "code": "UX", "description": "Creates accessible user interface layout design frameworks, high-fidelity application prototypes, design style guides, and user journey mockups." },
  { "name": "Operations & Logistics", "code": "OPS", "description": "Optimizes day-to-day workflow processes, manages physical office utilities facility management, vendor coordination, and global logistics chains." },
  { "name": "Quality Assurance", "code": "QA", "description": "Executes automated test suite scripts, coordinates staging environment deployment loops, manages bug tracking lists, and ensures code safety." },
  { "name": "Research & Development", "code": "RD", "description": "Explores bleeding-edge prototype concepts, assesses emerging technology frameworks, and builds minimal viable hardware/software products." },
  { "name": "Public Relations", "code": "PR", "description": "Manages external communication channels, drafts press release statements, fields news outlet inquiries, and coordinates investor relations profiles." }
];


async function seedDeptData () {
    try {

        console.log("🌱 Seeding data...");
        await Department.insertMany(dummyDepartments);
        console.log("🎉 SUCCESS! 15 Departments have been injected into your database.");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

module.exports = seedDeptData;
