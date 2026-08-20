/**
 * Backend-supported technology definitions as source of truth.
 * Aligned with backend constants and validation rules.
 */

export const BACKEND_TECHNOLOGIES = {
  frontend: [
    "React",
    "Next.js",
    "Angular",
    "Vue",
    "Svelte",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
  ],
  backend: [
    "Node.js",
    "Express",
    "NestJS",
    "Spring Boot",
    "Laravel",
    "ASP.NET",
    "Django",
    "Flask",
    "Ruby",
    "FastAPI",
  ],
  devops: [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Ansible",
    "Github Actions",
    "Gitlab CI/CD",
    "Heroku",
    "Grafana",
    "Prometheus",
  ],
  databases: [
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Oracle",
    "Microsoft SQL Server",
    "SQLite",
  ],
  database: [
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Oracle",
    "Microsoft SQL Server",
    "SQLite",
  ],
  cache: [
    "Redis",
    "Memcached",
    "MemSQL",
  ],
  queue: [
    "RabbitMQ",
    "Kafka",
    "ActiveMQ",
    "ZeroMQ",
    "Amazon SQS",
    "Google Cloud Pub/Sub",
    "Azure Service Bus",
  ],
  apiGateway: [
    "Kong",
    "NGINX",
    "AWS API Gateway",
    "Azure API Management",
    "Google API Gateway",
  ],
  "api-gateway": [
    "Kong",
    "NGINX",
    "AWS API Gateway",
    "Azure API Management",
    "Google API Gateway",
  ],
  cloudService: [
    "AWS Lambda",
    "Amazon S3",
    "Amazon EC2",
    "Amazon RDS",
    "Azure Blob Storage",
    "Cloud Run",
    "Cloud Functions",
    "Google Cloud Storage",
    "Google Cloud SQL",
    "Google Cloud Functions",
    "Google Cloud Firestore",
    "Google Cloud Datastore",
  ],
  "cloud-service": [
    "AWS Lambda",
    "Amazon S3",
    "Amazon EC2",
    "Amazon RDS",
    "Azure Blob Storage",
    "Cloud Run",
    "Cloud Functions",
    "Google Cloud Storage",
    "Google Cloud SQL",
    "Google Cloud Functions",
    "Google Cloud Firestore",
    "Google Cloud Datastore",
  ],
  thirdParty: [
    "Stripe",
    "Twilio",
    "Firebase",
    "Auth0",
    "Google Maps",
    "OpenAI",
    "SendGrid",
  ],
  dataScience: [
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
  ],
  uiux: [
    "Figma",
    "Adobe XD",
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Sketch",
    "InVision",
  ],
};

/**
 * Returns the supported technologies for a specific component type.
 * @param {string} type - Component type (e.g., 'backend', 'frontend', 'api-gateway', 'database', 'queue', 'cloud-service')
 * @returns {string[]}
 */
export const getTechnologiesForType = (type) => {
  if (!type) return [];
  const normalized = type.toLowerCase().replace(/[-_\s]/g, "");

  for (const [key, list] of Object.entries(BACKEND_TECHNOLOGIES)) {
    if (key.toLowerCase().replace(/[-_\s]/g, "") === normalized) {
      return list;
    }
  }

  return BACKEND_TECHNOLOGIES[type] || [];
};

/**
 * Returns all unique technologies across all categories.
 * @returns {string[]}
 */
export const getAllTechnologies = () => {
  const all = new Set();
  Object.values(BACKEND_TECHNOLOGIES).forEach((list) => {
    list.forEach((item) => all.add(item));
  });
  return Array.from(all);
};
