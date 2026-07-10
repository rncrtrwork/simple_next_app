import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('project image assets', () => {
  it('includes the bitmap folder tab and bank title icon assets', () => {
    const assets = ['public/assets/folder-tab.png', 'public/assets/bank-icon.png'];

    for (const asset of assets) {
      const path = resolve(asset);
      expect(existsSync(path), `${asset} should exist`).toBe(true);
      expect(statSync(path).size, `${asset} should not be empty`).toBeGreaterThan(1024);
    }
  });
});
