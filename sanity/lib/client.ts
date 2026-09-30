import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

// Client-safe (no token). Use only for public, unprotected fetches.
// All private-dataset reads must go through sanity/lib/server.ts instead.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
