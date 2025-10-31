/**
 * Worker Configuration
 * This file helps manage the Worker URL across different environments
 */

// Default Worker URL - update this after deploying the worker
// Format: https://tapestrai-worker.YOUR-SUBDOMAIN.workers.dev
export const WORKER_URL = 'https://tapestrai-worker.workers.dev';

// Helper function to get the correct endpoint
export function getWorkerEndpoint(provider) {
  return `${WORKER_URL}/api/${provider}`;
}
