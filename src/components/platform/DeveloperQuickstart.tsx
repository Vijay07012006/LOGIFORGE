'use client';

import React, { useState } from 'react';
import type { Template, TemplateProductMetadata } from '@/types/template';
import { CopySnippetButton } from './CopySnippetButton';
import { Terminal, Sparkles } from 'lucide-react';
import styles from './DeveloperQuickstart.module.css';

export interface DeveloperQuickstartProps {
  template: Template;
  product: TemplateProductMetadata;
}

type TabType = 'pnpm' | 'npm' | 'yarn' | 'bun' | 'cli';

interface TabConfig {
  id: TabType;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'cli', label: '⚡ npx CLI' },
  { id: 'pnpm', label: 'pnpm' },
  { id: 'npm', label: 'npm' },
  { id: 'yarn', label: 'yarn' },
  { id: 'bun', label: 'bun' },
];

export function DeveloperQuickstart({ template, product }: DeveloperQuickstartProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cli');
  const packageDir = `${template.slug}-starter`;
  const zipFile = product.packageUrl.split('/').pop() || `${template.slug}-v1.0.0.zip`;

  const getCommands = (tab: TabType): string => {
    switch (tab) {
      case 'cli':
        return `# Scaffold ${template.name} immediately via the LogiForge interactive CLI
npx logiforge init ${template.slug} --template-dir ./${packageDir}

# Navigate to the newly scaffolded project
cd ${packageDir}

# Start local development server
npm run dev`;

      case 'pnpm':
        return `# 1. Extract the downloaded starter package
unzip ${zipFile} -d ${packageDir}
cd ${packageDir}

# 2. Install dependencies with pnpm
pnpm install

# 3. Start local development server
pnpm dev

# 4. Create optimized standalone production build
pnpm build`;

      case 'yarn':
        return `# 1. Extract the downloaded starter package
unzip ${zipFile} -d ${packageDir}
cd ${packageDir}

# 2. Install dependencies with Yarn Berry
yarn install

# 3. Start local development server
yarn dev

# 4. Create optimized standalone production build
yarn build`;

      case 'bun':
        return `# 1. Extract the downloaded starter package
unzip ${zipFile} -d ${packageDir}
cd ${packageDir}

# 2. Fast install with Bun
bun install

# 3. Start high-speed local dev server
bun dev

# 4. Create optimized standalone production build
bun run build`;

      case 'npm':
      default:
        return `# 1. Extract the downloaded starter package
unzip ${zipFile} -d ${packageDir}
cd ${packageDir}

# 2. Install dependencies (Requires Node.js ${product.requirements.node})
npm install

# 3. Start local development server on port 3000
npm run dev

# 4. Create optimized standalone production build
npm run build`;
    }
  };

  const activeSnippet = getCommands(activeTab);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <Terminal size={18} />
          </div>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>Developer Quickstart</h2>
              <span className={styles.cliBadge}>
                <Sparkles size={12} />
                <span>One-Line Scaffold</span>
              </span>
            </div>
            <p className={styles.subtitle}>
              Instant zero-to-development setup for the standalone {template.name} starter architecture.
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <CopySnippetButton
            text={activeSnippet}
            label={`Copy ${activeTab === 'cli' ? 'CLI Command' : activeTab.toUpperCase() + ' Commands'}`}
            copiedLabel="Commands Copied!"
            variant="button"
            ariaLabel={`Copy quickstart shell commands for ${template.name}`}
          />
        </div>
      </div>

      {/* Package Manager / Tool Selector Tabs */}
      <div className={styles.tabBar} role="tablist" aria-label="Package Manager Tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.terminalWindow}>
        <div className={styles.terminalBar}>
          <div className={styles.terminalDots}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.terminalTitle}>bash — {activeTab} quickstart</span>
        </div>

        <pre className={styles.codeBlock}>
          <code>{activeSnippet}</code>
        </pre>
      </div>

      <div className={styles.stepsGrid}>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>01</div>
          <h3 className={styles.stepTitle}>Node.js Engine</h3>
          <p className={styles.stepDesc}>Requires Node.js {product.requirements.node} and modern ESM tooling. Validated with npm, pnpm, yarn, and bun.</p>
        </div>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>02</div>
          <h3 className={styles.stepTitle}>Isolated Assets</h3>
          <p className={styles.stepDesc}>All mock imagery, SVGs, and fonts reside in public/ and local CSS tokens with zero external asset dependencies.</p>
        </div>
        <div className={styles.stepCard}>
          <div className={styles.stepNum}>03</div>
          <h3 className={styles.stepTitle}>Next.js 15 App Router</h3>
          <p className={styles.stepDesc}>Pure React 19 architecture. Pre-configured with typed route contracts, Tailwind CSS, TypeScript strict, and ESLint.</p>
        </div>
      </div>
    </div>
  );
}
