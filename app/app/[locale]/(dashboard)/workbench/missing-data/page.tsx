import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { serverEnv } from '@/env/server'
import { DemandPanel } from '@/features/demand'
import { requireAnyRole } from '@/lib/server/auth-session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('demand')
  return { title: t('title'), robots: { index: false, follow: false } }
}

// 缺数据的需求（账 56）：用户查不到的公司汇总在这里，由我们决定采不采。
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAnyRole(locale, ['admin', 'operator'])
  const t = await getTranslations('demand')
  return (
    <div>
      <div className="admin-page-heading">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('lead')}</p>
      </div>
      <DemandPanel infoAdminUrl={serverEnv.INFO_ADMIN_URL ?? null} />
    </div>
  )
}
