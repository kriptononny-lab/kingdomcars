import type { Block } from 'payload';

/**
 * 3-step guided contact form block.
 * Step 1: service type (apartment / warehouse / trash / office)
 * Step 2: people count (1 / 2 / 3 / 3+)
 * Step 3: name + phone + email + message + consent → submitContactAction
 *
 * Contact data flows through the existing contactSchema and
 * submitContactAction — no duplicate server logic.
 */
export const WizardFormBlock: Block = {
  slug: 'wizardForm',
  labels: { singular: 'Wizard form', plural: 'Wizard forms' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
  ],
};
