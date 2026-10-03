import { TeachingConcept } from '../lessonConcepts';

export const DEVOPS_CONCEPTS: Record<string, TeachingConcept> = {
  'devops-linux-cli': {
    summary: 'Linux is the backbone operating system powering over 90% of the world’s cloud infrastructure. Command-line interface (CLI) mastery is essential for managing virtual machines, navigating directory trees, managing processes, and inspecting file systems.',
    keyRule: 'Core commands: pwd (current directory), ls -la (list files with details), cd (change directory), mkdir -p (create nested folders), rm -rf (remove recursively).',
    codeSnippet: `# Terminal session navigating cloud server
pwd
# /home/ubuntu
mkdir -p /var/www/codequest/dist
cd /var/www/codequest
ls -la`,
    codeLanguage: 'bash',
    terminalOutput: `total 24
drwxr-xr-x 4 ubuntu ubuntu 4096 Oct 03 12:00 .
drwxr-xr-x 3 root   root   4096 Oct 03 11:58 ..
-rw-r--r-- 1 ubuntu ubuntu  520 Oct 03 12:01 package.json
drwxr-xr-x 2 ubuntu ubuntu 4096 Oct 03 12:02 dist`,
    breakdown: [
      { term: 'mkdir -p', definition: 'Creates intermediate parent directories as needed without failing if they exist.', badge: 'Filesystem' },
      { term: 'ls -la', definition: 'Lists all files (including hidden dotfiles) with permissions, owner, and sizes.', badge: 'Listing' },
      { term: 'rm -rf', definition: 'Recursively and forcefully deletes target paths without interactive confirmation.', badge: 'Caution' }
    ],
    proTip: 'Use tab completion liberally in your bash shell to prevent typos when navigating long server paths.',
    commonMistake: 'Accidentally running "rm -rf /" or using unquoted variables like "rm -rf \$DIR/*" when \$DIR is empty, which wipes root directories!'
  },

  'devops-permissions': {
    summary: 'Linux enforces a strict multi-user security model using ownership (User, Group, Others) and permission bits (Read: 4, Write: 2, Execute: 1). chmod alters permissions, while chown modifies file ownership.',
    keyRule: 'chmod octal codes: 7 = rwx (4+2+1), 6 = rw- (4+2), 5 = r-x (4+1), 4 = r--. Example: 755 allows owner to write, others to read & execute.',
    codeSnippet: `# Make deployment script executable
chmod +x ./deploy.sh

# Set standard web directory permissions: owner full, group read/exec
chmod 755 /var/www/html

# Transfer ownership to service user
chown -R www-data:www-data /var/www/html`,
    codeLanguage: 'bash',
    terminalOutput: `-rwxr-xr-x 1 www-data www-data 1024 Oct 03 12:05 deploy.sh*
Permissions: 755 (Owner: rwx, Group: r-x, Others: r-x)`,
    breakdown: [
      { term: 'chmod (Change Mode)', definition: 'Modifies read (r), write (w), and execute (x) permission flags.', badge: 'Security' },
      { term: 'chown (Change Owner)', definition: 'Assigns file ownership to a designated user:group.', badge: 'Ownership' },
      { term: 'Execute Bit (+x)', definition: 'Required for shell scripts or binaries to be directly executable.', badge: 'Flags' }
    ],
    proTip: 'Never set chmod 777 on production servers—giving write access to "Others" allows any compromised process to overwrite files.',
    commonMistake: 'Forgetting to make newly created shell scripts executable with "chmod +x script.sh" before attempting to run "./script.sh".'
  },

  'devops-pipes': {
    summary: 'The Unix philosophy emphasizes small, single-purpose tools composed together via standard streams (stdin, stdout, stderr). The pipe operator (|) streams the stdout of one command directly into the stdin of another.',
    keyRule: '| pipes stdout to stdin. > overwrites a file; >> appends to a file. grep filters lines matching text patterns.',
    codeSnippet: `# Pipe real-time access log to grep for 500 server errors
cat /var/log/nginx/access.log | grep " 500 " | wc -l

# Follow live incoming logs into an audit file
tail -f /var/log/syslog | grep --line-buffered "SECURITY" >> /var/log/security-audit.log`,
    codeLanguage: 'bash',
    terminalOutput: `3 errors found matching HTTP 500
[2026-10-03 12:10:04] SECURITY: Failed SSH authentication attempt from 198.51.100.22`,
    breakdown: [
      { term: 'Pipe (|)', definition: 'Connects the standard output of the left command to standard input of the right command.', badge: 'Streams' },
      { term: 'Redirect Overwrite (>)', definition: 'Dumps output into a destination file, overwriting existing contents.', badge: 'I/O' },
      { term: 'Redirect Append (>>)', definition: 'Appends output lines safely to the end of a destination file.', badge: 'I/O' }
    ],
    proTip: 'Use "tail -f filename" when debugging active servers to watch lines stream into log files in real time.',
    commonMistake: 'Accidentally using a single > instead of >> when saving logs, which erases all previous history in the file!'
  },

  'devops-git-commits': {
    summary: 'Git is a distributed version control system tracking snapshots of your project over time. The staging area (the index) lets you curate exactly which modifications to package into your next commit.',
    keyRule: 'Workflow: git status (inspect) -> git add . (stage changes) -> git commit -m "message" (commit snapshot).',
    codeSnippet: `# Typical Git staging and commit workflow
git status
git add src/services/auth.ts src/data/curriculum.ts
git commit -m "feat(auth): implement JWT refresh token rotation"
git log --oneline -n 3`,
    codeLanguage: 'bash',
    terminalOutput: `[main 7f2a1b9] feat(auth): implement JWT refresh token rotation
 2 files changed, 48 insertions(+), 6 deletions(-)
7f2a1b9 feat(auth): implement JWT refresh token rotation
3c4d5e6 fix(css): resolve flexbox wrapping on mobile
1a2b3c4 chore: initial project scaffold`,
    breakdown: [
      { term: 'git add <files>', definition: 'Moves modified files from the working tree into the staging area.', badge: 'Staging' },
      { term: 'git commit -m', definition: 'Creates a permanent, SHA-1 hashed snapshot of the staged files.', badge: 'Commit' },
      { term: 'Conventional Commits', definition: 'Structured messages like feat:, fix:, docs:, chore: for clear changelogs.', badge: 'Best Practice' }
    ],
    proTip: 'Commit early and often with atomic commits: each commit should represent one focused, self-contained change.',
    commonMistake: 'Committing sensitive secrets (.env, API keys) into Git. Always configure a .gitignore file before your first commit!'
  },

  'devops-git-branches': {
    summary: 'Branches allow developers to work in isolated workspaces without interfering with the stable main branch. Feature branches are developed independently and merged back via pull requests.',
    keyRule: 'Modern Git syntax: git switch -c <branch> creates and switches to a branch. git merge <branch> combines history.',
    codeSnippet: `# Create and switch to new feature branch
git switch -c feature/oauth-login

# After making changes and committing:
git switch main
git merge feature/oauth-login`,
    codeLanguage: 'bash',
    terminalOutput: `Switched to a new branch 'feature/oauth-login'
Updating 7f2a1b9..9e8d7c6
Fast-forward
 src/components/OAuthModal.tsx | 72 +++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 72 insertions(+)`,
    breakdown: [
      { term: 'git switch -c', definition: 'The clean modern alternative to "git checkout -b" for creating branches.', badge: 'Modern Git' },
      { term: 'Fast-Forward Merge', definition: 'Occurs when main has no divergent commits; HEAD pointer simply moves forward.', badge: 'Merge' },
      { term: 'Merge Conflict', definition: 'Occurs when concurrent branches modify the exact same lines in different ways.', badge: 'Collaboration' }
    ],
    proTip: 'Always pull the latest changes from main before starting or merging your feature branch to resolve conflicts locally.',
    commonMistake: 'Directly pushing untested code to the production main branch instead of using feature branches and Pull Requests.'
  },

  'devops-git-remotes': {
    summary: 'Git remotes connect your local repository to centralized code collaboration platforms like GitHub, GitLab, and Bitbucket. git fetch downloads remote changes; git pull merges them; git push uploads local commits.',
    keyRule: 'git push -u origin <branch> publishes local commits and links your local branch to the remote tracking branch.',
    codeSnippet: `# Publish new branch to GitHub and set tracking
git push -u origin feature/oauth-login

# Synchronize local branch with teammates' updates
git pull origin main`,
    codeLanguage: 'bash',
    terminalOutput: `Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Writing objects: 100% (4/4), 1.25 KiB | 1.25 MiB/s, done.
To github.com:codequest/platform.git
 * [new branch]      feature/oauth-login -> feature/oauth-login
Branch 'feature/oauth-login' set up to track remote branch 'feature/oauth-login' from 'origin'.`,
    breakdown: [
      { term: 'origin', definition: 'The default alias name given to the primary remote repository URL.', badge: 'Remote' },
      { term: 'git pull', definition: 'Combines git fetch (downloading objects) with git merge into current branch.', badge: 'Sync' },
      { term: 'git push --force-with-lease', definition: 'Safe force-push checking that nobody pushed new commits since your last fetch.', badge: 'Safety' }
    ],
    proTip: 'Never use plain "git push --force" on shared branches—it overwrites teammates\' work. Use "--force-with-lease" if rebase requires updating.',
    commonMistake: 'Forgetting to set upstream tracking with -u on the first push, requiring explicit remote and branch arguments every time.'
  },

  'devops-docker-basics': {
    summary: 'Docker packages applications and their entire runtime dependencies into lightweight, standalone containers. Unlike virtual machines that emulate entire hardware kernels, containers share the host Linux kernel, booting in milliseconds with near-zero overhead.',
    keyRule: 'A Dockerfile defines image assembly: FROM (base image), WORKDIR (directory), COPY (files), RUN (build commands), and CMD (default startup command).',
    codeSnippet: `# Production Node.js Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
    codeLanguage: 'bash',
    terminalOutput: `Sending build context to Docker daemon  2.14MB
Step 1/7 : FROM node:20-alpine
Step 2/7 : WORKDIR /app
Step 3/7 : COPY package*.json ./
Step 4/7 : RUN npm ci --only=production
Step 5/7 : COPY . .
Step 6/7 : EXPOSE 3000
Step 7/7 : CMD ["node", "server.js"]
Successfully tagged codequest-app:v1.0`,
    breakdown: [
      { term: 'Image vs Container', definition: 'An image is the immutable blueprint; a container is a running, stateful instance of that image.', badge: 'Core' },
      { term: 'RUN vs CMD', definition: 'RUN executes during image build; CMD defines the process executed when the container starts.', badge: 'Lifecycle' },
      { term: 'Alpine Linux', definition: 'Ultra-minimal 5MB Linux distribution preferred for tiny, secure production container images.', badge: 'Base' }
    ],
    proTip: 'Copy package.json and run npm install BEFORE copying application source code to take full advantage of Docker layer caching.',
    commonMistake: 'Running containers as the root user. Add "USER node" in your Dockerfile to follow the principle of least privilege.'
  },

  'devops-docker-compose': {
    summary: 'Docker Compose defines and runs multi-container Docker applications. Using a single docker-compose.yml file, you configure web services, databases (PostgreSQL), and caching layers (Redis) with shared networking and persistent volumes.',
    keyRule: 'docker compose up -d launches all defined services in detached background mode. docker compose down tears down the stack.',
    codeSnippet: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=pass

volumes:
  pgdata:`,
    codeLanguage: 'bash',
    terminalOutput: `[+] Running 3/3
 ✔ Network codequest_default  Created
 ✔ Container codequest-db-1   Started
 ✔ Container codequest-web-1  Started
Services accessible at http://localhost:3000`,
    breakdown: [
      { term: 'Service Orchestration', definition: 'Declaring interconnected app containers running together on a private virtual network.', badge: 'Compose' },
      { term: 'Port Mapping ("3000:3000")', definition: 'Maps host_port:container_port so localhost traffic reaches the container.', badge: 'Networking' },
      { term: 'Named Volumes', definition: 'Persists database data on host storage so data survives container restarts.', badge: 'Storage' }
    ],
    proTip: 'Use service names as DNS hostnames inside the Compose network: the web service connects to PostgreSQL at "db:5432" automatically.',
    commonMistake: 'Forgetting to specify persistent volumes for database containers, causing all test database records to be wiped when containers restart.'
  },

  'devops-boss': {
    summary: 'The DevOps & Cloud Architect Boss Challenge verifies your ability to build automated CI/CD deployment pipelines, implement multi-stage container builds for minimal image size, and configure automated health check monitoring.',
    keyRule: 'Multi-stage builds separate the build environment from the production runtime, yielding tiny container images stripped of dev tools.',
    codeSnippet: `# Multi-stage Build for Maximum Security & Small Footprint
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/server.js"]`,
    codeLanguage: 'bash',
    terminalOutput: `Multi-stage build complete:
Builder image: 840MB (discarded)
Final runner image: 48MB (shipped to production)
CI/CD automated pipeline passed with 0 vulnerabilities!`,
    breakdown: [
      { term: 'Multi-Stage Build', definition: 'Discards compiler toolchains and build dependencies from the final image.', badge: 'Production' },
      { term: 'CI/CD Pipelines', definition: 'Automated test, build, and deploy workflows triggered on every git push.', badge: 'Automation' },
      { term: 'Health Checks', definition: 'Probes pinging service /health endpoints to automatically restart dead containers.', badge: 'Resilience' }
    ],
    proTip: 'Scan your production container images using vulnerability scanners (like Trivy or Docker Scout) inside your CI pipeline.',
    commonMistake: 'Shipping npm/yarn caches or TypeScript compilers inside production container images, inflating image size by hundreds of megabytes.'
  },

  // ==========================================
  // --- DEVOPS ADVANCED MODULES 4 & 5 ---
  // ==========================================
  'devops-k8s-architecture': {
    summary: 'Kubernetes (K8s) is the industry-standard container orchestration platform. It manages Pods (the fundamental unit of computation), Deployments for rolling updates, and ReplicaSets to guarantee high availability and self-healing workloads.',
    keyRule: 'Pods wrap co-located containers sharing IP & storage • kubectl apply -f manifest.yaml applies declarative state • Deployments enable zero-downtime rollouts.',
    codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: academy/api:v1.2
        ports:
        - containerPort: 3000`,
    codeLanguage: 'bash',
    terminalOutput: `deployment.apps/api-deployment created
replicas: 3/3 pods running across 3 worker nodes`,
    breakdown: [
      { term: 'Pod', definition: 'The smallest deployable unit in Kubernetes encapsulating one or more containers.', badge: 'K8s Unit' },
      { term: 'Deployment', definition: 'Declarative controller providing self-healing, rolling updates, and scaling.', badge: 'Workload' }
    ],
    proTip: 'Always configure container CPU and memory requests/limits in pod specs to prevent noisy neighbor resource starvation.',
    commonMistake: 'Deploying naked Pods directly instead of managing them under a Deployment controller.'
  },

  'devops-k8s-helm-ingress': {
    summary: 'Helm acts as the package manager for Kubernetes clusters, parameterizing complex YAML manifests into reusable charts. Ingress Controllers (like NGINX or Traefik) route external HTTPS internet traffic to internal cluster services.',
    keyRule: 'helm install <name> <chart> manages cluster packages • Ingress rules map domain hostnames to cluster Service ports.',
    codeSnippet: `# Install microservice with Helm
helm install web-service ./charts/web-service \
  --set replicaCount=4 \
  --set ingress.enabled=true`,
    codeLanguage: 'bash',
    terminalOutput: `NAME: web-service
STATUS: deployed
REVISION: 1
TEST SUITE: None`,
    breakdown: [
      { term: 'Helm Chart', definition: 'Package containing parameterized YAML templates and default values.yaml configurations.', badge: 'Helm' },
      { term: 'Ingress Controller', definition: 'Reverse proxy and layer-7 load balancer routing HTTP/HTTPS traffic into the cluster.', badge: 'Networking' }
    ],
    proTip: 'Use Helm values files (values-staging.yaml, values-prod.yaml) to maintain environment parity with zero code duplication.',
    commonMistake: 'Hardcoding secrets inside Helm values.yaml. Always use sealed secrets or external secrets managers like HashiCorp Vault.'
  },

  'devops-adv1-boss': {
    summary: 'The Production Kubernetes Cluster Boss Challenge assesses Horizontal Pod Autoscaling (HPA), readiness/liveness probes, and resource quota configurations.',
    keyRule: 'readinessProbe prevents routing traffic before initialization • Memory limit violations trigger OOMKilled (Exit 137).',
    codeSnippet: `readinessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10`,
    codeLanguage: 'bash',
    breakdown: [
      { term: 'Probes', definition: 'Liveness, readiness, and startup health checks executed periodically by the kubelet.', badge: 'Health' },
      { term: 'HPA', definition: 'Horizontal Pod Autoscaler scaling replica count dynamically based on CPU/RAM metrics.', badge: 'Autoscale' }
    ],
    proTip: 'Set readinessProbe initialDelaySeconds high enough so database connection pools can warm up before receiving live queries.',
    commonMistake: 'Configuring liveness probes that make external HTTP calls to downstream services; if the dependency goes down, all your pods will restart in a cascade.'
  },

  'devops-terraform-iac': {
    summary: 'Terraform is the leading declarative Infrastructure as Code (IaC) tool. Using HashiCorp Configuration Language (HCL), engineers provision multi-cloud VPC networks, clusters, databases, and DNS records with state locking.',
    keyRule: 'terraform init downloads providers • terraform plan previews changes • terraform apply applies real cloud state.',
    codeSnippet: `provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "assets" {
  bucket = "codequest-cloud-assets-prod"
  tags = {
    Environment = "Production"
  }
}`,
    codeLanguage: 'bash',
    terminalOutput: `Plan: 1 to add, 0 to change, 0 to destroy.
aws_s3_bucket.assets: Creating...
Apply complete! Resources: 1 added.`,
    breakdown: [
      { term: 'Declarative IaC', definition: 'You describe the desired end state, and Terraform computes the graph to achieve it.', badge: 'IaC' },
      { term: 'State Locking', definition: 'Prevents concurrent terraform apply executions from corrupting cloud infrastructure.', badge: 'Safety' }
    ],
    proTip: 'Always store terraform.tfstate in remote backend storage (like S3 + DynamoDB locking or GCS) rather than in git.',
    commonMistake: 'Manually editing cloud resources in the AWS/GCP web console (Configuration Drift), breaking Terraform state parity.'
  },

  'devops-cloud-monitoring': {
    summary: 'Modern site reliability engineering (SRE) relies on observability and canary releases. Prometheus scrapes metrics, Grafana visualizes p99 latency SLAs, and canary releases roll out changes to small traffic slices.',
    keyRule: 'PromQL computes p95/p99 percentiles with histogram_quantile • Canary deployments minimize failure blast radius.',
    codeSnippet: `# PromQL: 99th percentile request latency over last 5 minutes
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`,
    codeLanguage: 'bash',
    terminalOutput: `PromQL Query Result:
p99 Latency: 0.042s (42ms) -> Within SLA (< 100ms)`,
    breakdown: [
      { term: 'Canary Deployment', definition: 'Routing 5% of traffic to a new version, monitoring metrics, then progressively ramping to 100%.', badge: 'Rollout' },
      { term: 'Golden Signals', definition: 'Latency, Traffic, Errors, and Saturation monitoring (Google SRE standard).', badge: 'Observability' }
    ],
    proTip: 'Set automated rollback alerts when canary deployment error rates exceed 0.5% over a 3-minute window.',
    commonMistake: 'Monitoring only CPU and RAM averages rather than p99 request latency and HTTP 5xx error spikes.'
  },

  'devops-master-boss': {
    summary: 'The Principal Cloud & DevOps Architect Master Challenge tests disaster recovery (RTO/RPO), multi-region active-active architectures, and zero-downtime database migrations.',
    keyRule: 'RTO is maximum downtime duration • RPO is maximum allowable data loss window • Terraform modules standardize blueprints.',
    codeSnippet: `module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"
  cidr = "10.0.0.0/16"
  azs = ["us-east-1a", "us-east-1b", "us-east-1c"]
}`,
    codeLanguage: 'bash',
    breakdown: [
      { term: 'RTO & RPO', definition: 'Recovery Time Objective and Recovery Point Objective governing disaster recovery SLAs.', badge: 'Disaster Recovery' },
      { term: 'Multi-Region HA', definition: 'Active-Active cloud regions with global DNS anycast routing for 99.999% uptime.', badge: 'Architecture' }
    ],
    proTip: 'Practice automated Disaster Recovery "Chaos Engineering" drills to prove RTO targets before real outages happen.',
    commonMistake: 'Assuming backups work without automated periodic restore validation tests.'
  }
};
