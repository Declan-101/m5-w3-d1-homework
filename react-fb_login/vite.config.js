import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const keyPath = new URL('./.local-https/localhost.key', import.meta.url);
const certificatePath = new URL('./.local-https/localhost.pem', import.meta.url);

export default defineConfig({
  server: {
    port: 4175,
    strictPort: true,
    https: existsSync(keyPath) && existsSync(certificatePath)
      ? { key: readFileSync(keyPath), cert: readFileSync(certificatePath) }
      : undefined,
  },
});
