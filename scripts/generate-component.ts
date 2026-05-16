#!/usr/bin/env tsx
/**
 * Component scaffolder (§20).
 *
 * Usage:
 *   tsx scripts/generate-component.ts Button
 *   tsx scripts/generate-component.ts ContactCard --feature
 *
 * Defaults to `src/components/ui/`. Pass `--feature`, `--layout`, or
 * `--animation` to route into a different bucket. Co-locates a test file
 * per §4.4. We deliberately don't generate `*.stories.tsx` files — Storybook
 * isn't in the stack (§20 calls it optional).
 */
import fs from 'node:fs';
import path from 'node:path';

const BUCKETS = {
  ui: 'src/components/ui',
  feature: 'src/components/features',
  layout: 'src/components/layout',
  animation: 'src/components/animations',
  block: 'src/components/blocks',
} as const;

type BucketKey = keyof typeof BUCKETS;

function parseArgs(argv: string[]): { name: string; bucket: BucketKey } {
  const flags = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
  const positional = argv.filter((a) => !a.startsWith('--'));
  if (positional.length === 0) {
    console.error(
      'usage: tsx scripts/generate-component.ts <Name> [--ui|--feature|--layout|--animation|--block]',
    );
    process.exit(1);
  }
  const name = positional[0]!;
  if (!/^[A-Z][A-Za-z0-9]+$/.test(name)) {
    console.error(`Component name must be PascalCase, got: ${name}`);
    process.exit(1);
  }
  const bucket = (flags.find((f) => f in BUCKETS) as BucketKey | undefined) ?? 'ui';
  return { name, bucket };
}

const componentTemplate = (name: string) => `interface Props {
  /** TODO: define props */
  className?: string;
}

export function ${name}({ className }: Props) {
  return <div className={className}>${name}</div>;
}
`;

const testTemplate = (name: string) => `import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ${name} } from './${name}';

describe('<${name} />', () => {
  it('renders', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});
`;

function main() {
  const { name, bucket } = parseArgs(process.argv.slice(2));
  const dir = path.resolve(process.cwd(), BUCKETS[bucket]);
  const componentPath = path.join(dir, `${name}.tsx`);
  const testPath = path.join(dir, `${name}.test.tsx`);

  if (fs.existsSync(componentPath)) {
    console.error(`Refusing to overwrite ${componentPath}`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(componentPath, componentTemplate(name));
  fs.writeFileSync(testPath, testTemplate(name));

  console.warn(`✓ created ${path.relative(process.cwd(), componentPath)}`);
  console.warn(`✓ created ${path.relative(process.cwd(), testPath)}`);
}

main();
