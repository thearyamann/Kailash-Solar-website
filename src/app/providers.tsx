'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProviderReact } from 'posthog-js/react'
import { useEffect } from 'react'
import PostHogPageView from './PostHogPageView'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('optout=true')) {
      localStorage.setItem('ph_opt_out', 'true');
      alert('Tracking disabled for this device.');
    }

    const isOptedOut = typeof window !== 'undefined' && localStorage.getItem('ph_opt_out') === 'true';

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
      person_profiles: 'identified_only',
      capture_pageview: false,
      opt_out_capturing_by_default: isOptedOut
    })
  }, [])

  return (
    <PHProviderReact client={posthog}>
      <PostHogPageView />
      {children}
    </PHProviderReact>
  )
}
