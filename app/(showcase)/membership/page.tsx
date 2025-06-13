import MembershipPageClient from './membership-client'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata.membership

export default function MembershipPage() {
  return <MembershipPageClient />
}