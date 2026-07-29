import type { Metadata } from 'next'

import { ResearchRuntimePanel } from '@/components/research/research-runtime-panel'
import { requireAnyRole } from '@/lib/server/auth-session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Research runtime',
  robots: { index: false, follow: false },
}

export default async function ResearchRuntimePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAnyRole(locale, ['admin', 'operator'])
  return (
    <div>
      <div className="admin-page-heading">
        <h1 className="text-2xl font-semibold">Research runtime</h1>
        <p className="text-muted-foreground">
          Minimal Runtime/Agent governance surface. Common Admin shell comes from the
          frozen Next Admin template; Vue demo UI remains archived under
          docs/p0-009d-domain-keep.
        </p>
      </div>
      <ResearchRuntimePanel />
    </div>
  )
}
