/**
 * Google Cloud Function Entry Point
 * This file imports and exports the webhook handler for Cloud Functions
 */

import { handleStripeWebhook } from './stripe-webhook-handler.js';

// Export the function for Google Cloud Functions
export const stripeWebhook = handleStripeWebhook;
