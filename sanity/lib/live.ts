// Live Content API wiring. serverToken only — never set browserToken for the
// private dataset, otherwise the read token would leak to the browser.
import {defineLive} from 'next-sanity/live'
import {client} from './client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
})
