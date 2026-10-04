import { Module } from '../curriculum';

export const DEVOPS_MODULES: Module[] = [
  {
    id: 'devops-1',
    title: 'Linux Systems & Shell Operations',
    subtitle: 'Module 1',
    description: 'Master terminal navigation, file permissions, background jobs, and stream piping.',
    lessons: [
      {
        id: 'devops-linux-cli',
        title: 'Linux Navigation & File Ops',
        description: 'Navigate directories, list files, view disk usage, and create folders with CLI commands.',
        exercises: [
          {
            id: 'do-cli-1',
            type: 'fill',
            question: 'Create a nested directory structure -p and list hidden files with detailed metadata:',
            hint: 'mkdir -p creates parent directories; ls -la shows hidden files and permissions.',
            code: ['mkdir', '-p', 'src/services/auth', '\n', 'ls', '-la'],
            blanks: [1, 4],
            options: ['-p', '-la', '-r', '-f', '-v', 'rmdir'],
            correct: ['-p', '-la'],
            explanation: 'mkdir -p creates nested directory paths if they do not exist; ls -la lists all files including dotfiles.'
          },
          {
            id: 'do-cli-2',
            type: 'choice',
            question: 'Which Linux command prints the full absolute path of the current working directory?',
            hint: 'pwd stands for Print Working Directory.',
            options: ['pwd', 'cd', 'dir', 'whereami'],
            correct: ['pwd'],
            explanation: 'pwd outputs the full hierarchical pathname of the current working directory.'
          },
          {
            id: 'do-cli-3',
            type: 'create',
            question: 'Write the command to recursively remove directory /tmp/build without asking for confirmation:',
            hint: 'rm -rf /tmp/build',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Write remove command\n...',
            options: [],
            correct: ['rm -rf /tmp/build', 'rm -fr /tmp/build', 'rm -r -f /tmp/build'],
            explanation: 'rm -rf recursively (-r) and forcefully (-f) removes files and subdirectories.'
          }
        ]
      },
      {
        id: 'devops-permissions',
        title: 'Permissions & Ownership (chmod)',
        description: 'Understand read, write, execute permissions and numeric modes (e.g., 755, 644).',
        exercises: [
          {
            id: 'do-perm-1',
            type: 'choice',
            question: 'In Linux permissions (e.g. 755), what exact permission does numeric 7 give to the owner?',
            hint: '4 (read) + 2 (write) + 1 (execute) = 7 (rwx)',
            options: [
              'Read, Write, and Execute (rwx)',
              'Read only (r--)',
              'Write and Execute only (-wx)',
              'Superuser root bypass'
            ],
            correct: ['Read, Write, and Execute (rwx)'],
            explanation: 'Octal 7 represents full permissions: Read (4) + Write (2) + Execute (1) = 7.'
          },
          {
            id: 'do-perm-2',
            type: 'fill',
            question: 'Make deploy.sh executable by adding the execute bit for all users:',
            hint: 'chmod +x deploy.sh',
            code: ['chmod', '+x', 'deploy.sh'],
            blanks: [0, 1],
            options: ['chmod', '+x', 'chown', '777', 'exec', '+w'],
            correct: ['chmod', '+x'],
            explanation: 'chmod +x adds executable flag permissions to the specified script file.'
          },
          {
            id: 'do-perm-3',
            type: 'create',
            question: 'Which Linux command changes file ownership to user "ubuntu" and group "www-data"?',
            hint: 'chown ubuntu:www-data file.txt',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Change user and group ownership of app.log\n...',
            options: [],
            correct: [
              'chown ubuntu:www-data app.log',
              'chown ubuntu:www-data app.log;',
              'chown ubuntu.www-data app.log'
            ],
            explanation: 'chown user:group filename changes both user and group ownership of files.'
          }
        ]
      },
      {
        id: 'devops-pipes',
        title: 'Pipes & Stream Redirection (|, grep)',
        description: 'Chain commands using pipes, filter log streams with grep, and redirect standard streams.',
        exercises: [
          {
            id: 'do-p-1',
            type: 'fill',
            question: 'Pipe server logs into grep to filter lines containing "ERROR":',
            hint: 'cat server.log | grep "ERROR"',
            code: ['cat', 'server.log', '|', 'grep', '"ERROR"'],
            blanks: [2, 3],
            options: ['|', 'grep', '>', 'find', '&&', 'awk'],
            correct: ['|', 'grep'],
            explanation: 'The pipe character (|) feeds stdout of the left command into stdin of grep.'
          },
          {
            id: 'do-p-2',
            type: 'choice',
            question: 'What is the difference between > and >> when redirecting command output to a file?',
            hint: 'One overwrites existing contents, the other appends to the end of the file.',
            options: [
              '> overwrites the target file, while >> appends to the end of the file',
              '> sends output to stderr, while >> sends output to stdout',
              '> only works with plain text files',
              '>> runs the command asynchronously in the background'
            ],
            correct: ['> overwrites the target file, while >> appends to the end of the file'],
            explanation: '> truncates and overwrites destination files, whereas >> appends new lines safely.'
          },
          {
            id: 'do-p-3',
            type: 'create',
            question: 'Write a command to continuously follow new incoming lines written to /var/log/nginx/access.log:',
            hint: 'tail -f /var/log/nginx/access.log',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Follow live log file\n...',
            options: [],
            correct: [
              'tail -f /var/log/nginx/access.log',
              'tail -F /var/log/nginx/access.log',
              'tail -f /var/log/nginx/access.log;'
            ],
            explanation: 'tail -f streams real-time appends to files as they are written by background services.'
          }
        ]
      }
    ]
  },
  {
    id: 'devops-2',
    title: 'Git Version Control & Collaboration',
    subtitle: 'Module 2',
    description: 'Track code revisions, stage diffs, create feature branches, and merge pull requests.',
    lessons: [
      {
        id: 'devops-git-commits',
        title: 'Git Staging & Commits',
        description: 'Stage modified files with git add and record snapshots with meaningful git commit messages.',
        exercises: [
          {
            id: 'do-gc-1',
            type: 'fill',
            question: 'Stage all modified files in the repository and create a commit:',
            hint: 'git add -A and git commit -m "..."',
            code: ['git', 'add', '.', '\ngit', 'commit', '-m', '"feat: implement user auth"'],
            blanks: [1, 4],
            options: ['add', 'commit', 'push', 'stage', 'save', 'checkout'],
            correct: ['add', 'commit'],
            explanation: 'git add prepares changes in the staging index; git commit seals them into project history.'
          },
          {
            id: 'do-gc-2',
            type: 'choice',
            question: 'Which Git command shows unstaged modifications, staged files, and untracked files?',
            hint: 'git status',
            options: ['git status', 'git diff --staged', 'git log --oneline', 'git check'],
            correct: ['git status'],
            explanation: 'git status provides an overview of the working tree and current branch status.'
          },
          {
            id: 'do-gc-3',
            type: 'create',
            question: 'Write the command to view the last 5 commits in compact one-line format:',
            hint: 'git log --oneline -n 5 or git log -n 5 --oneline',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Show 5 recent commits\n...',
            options: [],
            correct: [
              'git log --oneline -n 5',
              'git log -n 5 --oneline',
              'git log --oneline -5',
              'git log -5 --oneline'
            ],
            explanation: 'git log --oneline formats commit hashes and titles on single readable lines.'
          }
        ]
      },
      {
        id: 'devops-git-branches',
        title: 'Branching & Switching (checkout/switch)',
        description: 'Create isolated feature branches, switch workspaces, and avoid committing directly to main.',
        exercises: [
          {
            id: 'do-gb-1',
            type: 'fill',
            question: 'Create and immediately switch to a new branch named feature-payments in modern Git:',
            hint: 'git switch -c feature-payments or git checkout -b feature-payments',
            code: ['git', 'switch', '-c', 'feature-payments'],
            blanks: [1, 2],
            options: ['switch', '-c', 'checkout', '-b', 'branch', 'create'],
            correct: ['switch', '-c'],
            explanation: 'git switch -c <name> is the modern Git command to create and switch to a branch in one step.'
          },
          {
            id: 'do-gb-2',
            type: 'choice',
            question: 'What occurs during a Git "Fast-Forward" merge?',
            hint: 'The target branch pointer simply moves forward without needing a merge commit.',
            options: [
              'The branch pointer is simply moved forward because there were no divergent commits',
              'All files are automatically reformatted with Prettier',
              'Git permanently deletes the source branch history',
              'A rebase conflict is automatically raised'
            ],
            correct: ['The branch pointer is simply moved forward because there were no divergent commits'],
            explanation: 'A fast-forward merge occurs when the main branch has had no new commits since the feature diverged.'
          },
          {
            id: 'do-gb-3',
            type: 'create',
            question: 'Merge branch "feature-ui" into your current checked-out branch:',
            hint: 'git merge feature-ui',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Merge feature-ui\n...',
            options: [],
            correct: ['git merge feature-ui', 'git merge feature-ui;'],
            explanation: 'git merge combines the specified branch into the current HEAD branch.'
          }
        ]
      },
      {
        id: 'devops-git-remotes',
        title: 'Remotes & Synchronization (push/pull)',
        description: 'Synchronize commits with remote repositories like GitHub using fetch, pull, and push.',
        exercises: [
          {
            id: 'do-gr-1',
            type: 'fill',
            question: 'Download remote commits and merge them into the local branch in one step:',
            hint: 'git pull origin main',
            code: ['git', 'pull', 'origin', 'main'],
            blanks: [1, 2],
            options: ['pull', 'origin', 'fetch', 'push', 'remote', 'upstream'],
            correct: ['pull', 'origin'],
            explanation: 'git pull combines git fetch (downloading changes) with git merge into your working branch.'
          },
          {
            id: 'do-gr-2',
            type: 'choice',
            question: 'What is the primary danger of running git push --force on a shared main branch?',
            hint: 'It can overwrite other developers’ commits that exist on the remote repository.',
            options: [
              'It overwrites remote history, permanently erasing commits made by teammates',
              'It burns cloud compute credits on GitHub',
              'It locks the repository against further reads for 24 hours',
              'It corrupts local Git objects'
            ],
            correct: ['It overwrites remote history, permanently erasing commits made by teammates'],
            explanation: 'git push --force forcibly replaces the remote branch with local HEAD, wiping out team contributions.'
          },
          {
            id: 'do-gr-3',
            type: 'create',
            question: 'Push your current local branch to remote "origin" and set upstream tracking to "main":',
            hint: 'git push -u origin main',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Push and set upstream\n...',
            options: [],
            correct: [
              'git push -u origin main',
              'git push --set-upstream origin main',
              'git push -u origin main;'
            ],
            explanation: 'git push -u sets the upstream branch reference so future commands only need git push.'
          }
        ]
      }
    ]
  },
  {
    id: 'devops-3',
    title: 'Docker Containers & CI/CD Cloud',
    subtitle: 'Module 3',
    description: 'Containerize applications with Dockerfiles, manage services with Compose, and run CI pipelines.',
    lessons: [
      {
        id: 'devops-docker-basics',
        title: 'Dockerfiles & Images',
        description: 'Build lightweight, reproducible container images with FROM, WORKDIR, COPY, and CMD.',
        exercises: [
          {
            id: 'do-db-1',
            type: 'fill',
            question: 'Complete the Dockerfile instructions to specify the base image and working directory:',
            hint: 'FROM node:20-alpine and WORKDIR /app',
            code: ['FROM', 'node:20-alpine', '\n', 'WORKDIR', '/app', '\nCOPY . .'],
            blanks: [0, 3],
            options: ['FROM', 'WORKDIR', 'BASE', 'DIR', 'RUN', 'START'],
            correct: ['FROM', 'WORKDIR'],
            explanation: 'FROM sets the base container image; WORKDIR sets the execution directory for subsequent steps.'
          },
          {
            id: 'do-db-2',
            type: 'choice',
            question: 'What is the difference between RUN and CMD instructions in a Dockerfile?',
            hint: 'RUN executes during image build time; CMD provides the default runtime command when container boots.',
            options: [
              'RUN executes during image build; CMD runs when the container is started',
              'RUN is only for Windows containers; CMD is for Linux',
              'CMD can only run shell scripts; RUN compiles binary files',
              'They are completely identical synonyms'
            ],
            correct: ['RUN executes during image build; CMD runs when the container is started'],
            explanation: 'RUN commits new layers during image creation, while CMD defines the process spawned when a container starts.'
          },
          {
            id: 'do-db-3',
            type: 'create',
            question: 'Build a Docker image from the current directory tagged as "my-app:v1":',
            hint: 'docker build -t my-app:v1 .',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Build docker image\n...',
            options: [],
            correct: [
              'docker build -t my-app:v1 .',
              'docker build -t my-app:v1 . ;',
              'docker image build -t my-app:v1 .'
            ],
            explanation: 'docker build -t <tag> . packages the current context into a local container image.'
          }
        ]
      },
      {
        id: 'devops-docker-compose',
        title: 'Multi-Container Docker Compose',
        description: 'Orchestrate web apps, databases, and caches in unison using docker-compose.yml.',
        exercises: [
          {
            id: 'do-dc-1',
            type: 'fill',
            question: 'Map host port 8080 to container port 3000 in a docker-compose.yml service definition:',
            hint: 'ports: - "8080:3000"',
            code: ['ports:', '\n  - ', '"8080:3000"'],
            blanks: [0, 2],
            options: ['ports:', '"8080:3000"', 'expose:', 'network:', '"3000:8080"', 'bind:'],
            correct: ['ports:', '"8080:3000"'],
            explanation: 'Host-to-container port mapping syntax in Docker Compose is always "hostPort:containerPort".'
          },
          {
            id: 'do-dc-2',
            type: 'choice',
            question: 'Which command launches all services defined in docker-compose.yml in detached background mode?',
            hint: 'docker compose up -d',
            options: [
              'docker compose up -d',
              'docker compose start --all',
              'docker compose run -b',
              'docker compose daemon'
            ],
            correct: ['docker compose up -d'],
            explanation: 'docker compose up -d starts all containers in detached mode, returning control to your terminal.'
          },
          {
            id: 'do-dc-3',
            type: 'create',
            question: 'Stop and remove all containers, networks, and volumes defined in docker-compose:',
            hint: 'docker compose down',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Teardown compose stack\n...',
            options: [],
            correct: [
              'docker compose down',
              'docker-compose down',
              'docker compose down -v'
            ],
            explanation: 'docker compose down gracefully stops and destroys all containers and networks for the stack.'
          }
        ]
      },
      {
        id: 'devops-boss',
        title: 'DevOps & Cloud Architect Boss',
        isBoss: true,
        description: 'Synthesize container isolation, health checks, CI/CD automated test workflows, and cloud deployments.',
        exercises: [
          {
            id: 'do-b-1',
            type: 'fill',
            question: 'Define a GitHub Actions CI step that executes unit tests on push to main:',
            hint: 'run: npm test',
            code: ['- name: Run Test Suite\n  ', 'run', ':', 'npm test'],
            blanks: [1, 3],
            options: ['run', 'npm test', 'exec', 'command', 'test:run', 'step'],
            correct: ['run', 'npm test'],
            explanation: 'GitHub Actions uses the run: key to execute bash commands inside CI runner virtual machines.'
          },
          {
            id: 'do-b-2',
            type: 'choice',
            question: 'What is the primary benefit of Multi-Stage Docker builds in production?',
            hint: 'Build tools like compilers and devDependencies are discarded, keeping the final production image tiny.',
            options: [
              'Drastically shrinks final image size and eliminates build-tool security vulnerabilities',
              'Runs containers across multiple physical cloud providers simultaneously',
              'Bypasses Linux kernel namespaces',
              'Automatically generates SSL TLS certificates'
            ],
            correct: ['Drastically shrinks final image size and eliminates build-tool security vulnerabilities'],
            explanation: 'Multi-stage builds leave compilers and dev toolchains behind, shipping only runtime artifacts for tiny, secure images.'
          },
          {
            id: 'do-b-3',
            type: 'create',
            question: 'Check running Docker containers with process status, ports, and image names:',
            hint: 'docker ps',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// List active containers\n...',
            options: [],
            correct: ['docker ps', 'docker container ls', 'docker ps -a'],
            explanation: 'docker ps prints real-time status of all active containers, including port forwards and uptime.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): KUBERNETES ORCHESTRATION & HELM ---
  // ==========================================
  {
    id: 'devops-adv-1',
    title: 'Kubernetes Orchestration, Pods & Helm',
    subtitle: 'Advance Module 4',
    description: 'Deploy auto-scaling container fleets across clusters with Kubernetes Pods, Services, and Helm package charts.',
    isAdvanced: true,
    lessons: [
      {
        id: 'devops-k8s-architecture',
        title: 'Kubernetes Pods, Deployments & ReplicaSets',
        description: 'Declare self-healing container workloads with zero-downtime rolling updates.',
        exercises: [
          {
            id: 'k8s-1',
            type: 'choice',
            question: 'What is a Pod in Kubernetes architecture?',
            hint: 'The smallest deployable computing unit in Kubernetes, wrapping one or more containers.',
            options: [
              'The smallest deployable computing unit, encapsulating one or more tightly-coupled containers',
              'A physical bare-metal server in a Google data center',
              'A type of git commit hash',
              'A proprietary database format'
            ],
            correct: ['The smallest deployable computing unit, encapsulating one or more tightly-coupled containers'],
            explanation: 'Pods share network namespaces, IP addresses, and shared storage volumes across co-located containers.'
          },
          {
            id: 'k8s-2',
            type: 'fill',
            question: 'Scale a Kubernetes deployment named web-app to 5 replicas using kubectl:',
            hint: 'kubectl scale deployment web-app --replicas=5',
            code: ['kubectl', 'scale', 'deployment web-app --', 'replicas', '=5'],
            blanks: [1, 3],
            options: ['scale', 'replicas', 'autoscale', 'instances', 'pods', 'grow'],
            correct: ['scale', 'replicas'],
            explanation: 'kubectl scale deployment <name> --replicas=n adjusts target replica count instantly.'
          },
          {
            id: 'k8s-3',
            type: 'create',
            question: 'Write the kubectl command to apply a YAML manifest named deployment.yaml:',
            hint: 'kubectl apply -f deployment.yaml',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Apply declarative K8s manifest\n...',
            options: [],
            correct: [
              'kubectl apply -f deployment.yaml',
              'kubectl apply -f deployment.yaml;',
              'kubectl apply -f ./deployment.yaml'
            ],
            explanation: 'kubectl apply -f manifest.yaml applies declarative infrastructure state to the cluster API server.'
          }
        ]
      },
      {
        id: 'devops-k8s-helm-ingress',
        title: 'Ingress Controllers, ConfigMaps & Helm',
        description: 'Package microservices with Helm templates and route external traffic with NGINX Ingress.',
        exercises: [
          {
            id: 'khi-1',
            type: 'choice',
            question: 'What is Helm in the Kubernetes ecosystem?',
            hint: 'The package manager for Kubernetes (like npm or apt for clusters).',
            options: [
              'The official package manager for Kubernetes that templated charts and manages release rollbacks',
              'A Linux kernel patch',
              'A JavaScript test framework',
              'A firewall appliance'
            ],
            correct: ['The official package manager for Kubernetes that templated charts and manages release rollbacks'],
            explanation: 'Helm uses charts to parameterize YAML manifests and manage multi-environment releases.'
          },
          {
            id: 'khi-2',
            type: 'fill',
            question: 'Install a Helm chart release named my-api from the charts directory:',
            hint: 'helm install my-api ./charts/api',
            code: ['helm', 'install', 'my-api ./charts/api'],
            blanks: [1],
            options: ['install', 'upgrade', 'deploy', 'run', 'push'],
            correct: ['install'],
            explanation: 'helm install <release-name> <chart-path> creates a new release in the active namespace.'
          },
          {
            id: 'khi-3',
            type: 'create',
            question: 'Write the command to view all running pods across all namespaces in a Kubernetes cluster:',
            hint: 'kubectl get pods -A',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Get pods across all namespaces\n...',
            options: [],
            correct: [
              'kubectl get pods -A',
              'kubectl get pods --all-namespaces',
              'kubectl get pods -A;'
            ],
            explanation: 'kubectl get pods -A (or --all-namespaces) queries the cluster control plane for all pod states.'
          }
        ]
      },
      {
        id: 'devops-adv1-boss',
        title: 'Production Kubernetes Cluster Boss Challenge',
        isBoss: true,
        description: 'Prove mastery over resource limits, liveness/readiness probes, and horizontal pod autoscaling (HPA).',
        exercises: [
          {
            id: 'kcb-1',
            type: 'choice',
            question: 'What happens when a container exceeds its configured Kubernetes Memory limit (resources.limits.memory)?',
            hint: 'The Linux kernel OOM killer terminates the container.',
            options: [
              'The container is killed with OOMKilled (Exit Code 137) and automatically restarted',
              'The server CPU clock speed is doubled',
              'The cluster is immediately destroyed',
              'The app runs in slow mode'
            ],
            correct: ['The container is killed with OOMKilled (Exit Code 137) and automatically restarted'],
            explanation: 'Exceeding memory limits triggers Linux cgroups OOMKilled (137); K8s restarts it per restartPolicy.'
          },
          {
            id: 'kcb-2',
            type: 'fill',
            question: 'Define a readiness probe to check /healthz HTTP endpoint before routing live user traffic:',
            hint: 'readinessProbe: httpGet: path: /healthz port: 8080',
            code: ['readinessProbe', ':\n  httpGet:\n    path: /healthz\n    port:', '8080'],
            blanks: [0, 2],
            options: ['readinessProbe', '8080', 'livenessProbe', 'startupProbe', 'healthCheck', '80'],
            correct: ['readinessProbe', '8080'],
            explanation: 'Readiness probes ensure services only receive network traffic once dependencies and caches are warm.'
          },
          {
            id: 'kcb-3',
            type: 'create',
            question: 'Write the kubectl command to view the live streaming log output of a pod named "api-pod-123":',
            hint: 'kubectl logs -f api-pod-123',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Stream logs from pod\n...',
            options: [],
            correct: [
              'kubectl logs -f api-pod-123',
              'kubectl logs -f api-pod-123;',
              'kubectl logs --follow api-pod-123'
            ],
            explanation: 'kubectl logs -f streams stdout/stderr output from the container in real time.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): TERRAFORM & CLOUD ARCHITECTURE ---
  // ==========================================
  {
    id: 'devops-adv-2',
    title: 'Infrastructure as Code (Terraform) & Cloud Architecture',
    subtitle: 'Advance Module 5',
    description: 'Provision immutable cloud VPCs, auto-scaling groups, and zero-downtime canary deployments with Terraform HCL.',
    isAdvanced: true,
    lessons: [
      {
        id: 'devops-terraform-iac',
        title: 'Declarative Terraform HCL & State Files',
        description: 'Codify cloud infrastructure with HashiCorp Configuration Language (HCL) and remote state locking.',
        exercises: [
          {
            id: 'dti-1',
            type: 'choice',
            question: 'What is the purpose of the terraform.tfstate file in Terraform?',
            hint: 'It maps declared HCL configuration to real-world cloud resources in AWS/GCP/Azure.',
            options: [
              'Tracks real-world cloud resource metadata and dependencies to compute plan execution diffs',
              'Stores user passwords in plain text',
              'Compiles HCL to C++',
              'Installs Docker on developer machines'
            ],
            correct: ['Tracks real-world cloud resource metadata and dependencies to compute plan execution diffs'],
            explanation: 'Terraform state is the single source of truth mapping your code to provisioned cloud resources.'
          },
          {
            id: 'dti-2',
            type: 'fill',
            question: 'Initialize Terraform provider plugins and preview planned cloud changes:',
            hint: 'terraform init && terraform plan',
            code: ['terraform', 'init', '\nterraform', 'plan'],
            blanks: [1, 3],
            options: ['init', 'plan', 'apply', 'destroy', 'validate', 'format'],
            correct: ['init', 'plan'],
            explanation: 'terraform init downloads cloud provider binaries, and terraform plan previews the execution graph.'
          },
          {
            id: 'dti-3',
            type: 'create',
            question: 'Write the command to apply declarative Terraform changes without interactive confirmation prompt:',
            hint: 'terraform apply -auto-approve',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Automated CI/CD terraform apply\n...',
            options: [],
            correct: [
              'terraform apply -auto-approve',
              'terraform apply --auto-approve',
              'terraform apply -auto-approve;'
            ],
            explanation: 'terraform apply -auto-approve applies the execution plan directly in CI/CD automation pipelines.'
          }
        ]
      },
      {
        id: 'devops-cloud-monitoring',
        title: 'Observability, Prometheus & Canary Deployments',
        description: 'Track p99 latency SLAs with Prometheus/Grafana and safely roll out canary traffic.',
        exercises: [
          {
            id: 'dcm-1',
            type: 'choice',
            question: 'What is a Canary Deployment strategy in cloud DevOps?',
            hint: 'Routing a small percentage (e.g., 5%) of production traffic to the new version before 100% rollout.',
            options: [
              'Routing a small slice of traffic (e.g. 5%) to a new version to verify health before full rollout',
              'Shutting down all servers simultaneously at midnight',
              'Testing code only on developer localhost',
              'Using birds to deliver server hard drives'
            ],
            correct: ['Routing a small slice of traffic (e.g. 5%) to a new version to verify health before full rollout'],
            explanation: 'Canary deployments minimize blast radius by verifying error rates and latency on small traffic samples.'
          },
          {
            id: 'dcm-2',
            type: 'fill',
            question: 'Query Prometheus for the 99th percentile HTTP request duration over the last 5 minutes in PromQL:',
            hint: 'histogram_quantile(0.99, sum(rate(http_duration_bucket[5m])) by (le))',
            code: ['histogram_quantile', '(0.99, sum(rate(http_duration_bucket[5m])) by (le))'],
            blanks: [0],
            options: ['histogram_quantile', 'percentile_99', 'avg_over_time', 'rate', 'delta'],
            correct: ['histogram_quantile'],
            explanation: 'histogram_quantile() computes accurate tail latency percentiles (p95/p99) from bucket metrics.'
          },
          {
            id: 'dcm-3',
            type: 'create',
            question: 'Write the Prometheus metric type that records increment-only values like total HTTP requests:',
            hint: 'Counter',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Metric type for monotonically increasing values\ntype: "..."',
            options: [],
            correct: ['Counter', 'counter', 'Prometheus.Counter'],
            explanation: 'Counter metrics only increase (or reset to 0 upon process restart).'
          }
        ]
      },
      {
        id: 'devops-master-boss',
        title: 'Principal Cloud & DevOps Architect Master Challenge',
        isBoss: true,
        description: 'Prove full mastery over multi-region High Availability, Terraform modules, and disaster recovery.',
        exercises: [
          {
            id: 'dmb-1',
            type: 'choice',
            question: 'What is Recovery Time Objective (RTO) vs Recovery Point Objective (RPO) in disaster recovery?',
            hint: 'RTO is maximum acceptable downtime duration; RPO is maximum acceptable data loss period.',
            options: [
              'RTO is maximum allowed downtime; RPO is maximum allowed data loss window',
              'RTO is CPU speed; RPO is RAM capacity',
              'RTO is build time; RPO is test pass rate',
              'They are identical metric terms'
            ],
            correct: ['RTO is maximum allowed downtime; RPO is maximum allowed data loss window'],
            explanation: 'RTO defines how quickly systems must be restored; RPO defines how much data (in time) you can lose.'
          },
          {
            id: 'dmb-2',
            type: 'fill',
            question: 'Instantiate a reusable Terraform module for a Virtual Private Cloud (VPC):',
            hint: 'module "vpc" { source = "terraform-aws-modules/vpc/aws" }',
            code: ['module', '"vpc" {\n  source = "terraform-aws-modules/vpc/aws"\n  cidr = "10.0.0.0/16"\n}'],
            blanks: [0],
            options: ['module', 'resource', 'variable', 'output', 'provider'],
            correct: ['module'],
            explanation: 'module blocks encapsulate reusable, tested infrastructure blueprints.'
          },
          {
            id: 'dmb-3',
            type: 'create',
            question: 'Write the command to format all Terraform files in current directory to canonical standard style:',
            hint: 'terraform fmt',
            placeholder: 'e.g., command --flag or syntax',
            starterCode: '// Format all .tf files\n...',
            options: [],
            correct: ['terraform fmt', 'terraform fmt;', 'terraform fmt -recursive'],
            explanation: 'terraform fmt applies canonical formatting and indentation to all .tf configuration files.'
          }
        ]
      }
    ]
  }
];
