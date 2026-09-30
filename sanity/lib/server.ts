import 'server-only'

import {createClient, type QueryParams} from 'next-sanity'

import {apiVersion, dataset, projectId, serverToken} from '../env'

// Server-only client for the private dataset. No token ever reaches the browser.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: serverToken,
})

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: SanityFetchOptions): Promise<T> {
  return serverClient.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}
