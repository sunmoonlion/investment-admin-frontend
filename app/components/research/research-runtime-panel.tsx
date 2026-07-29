'use client'

import { useTranslations } from 'next-intl'

export function ResearchRuntimePanel() {
  const t = useTranslations('ResearchRuntime')
  return (
    <section className="mt-6 space-y-3 rounded-lg border border-border p-4">
      <h2 className="text-lg font-medium">{t('title')}</h2>
      <p className="text-sm text-muted-foreground">{t('description')}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Admin API: POST /api/agent/sessions</li>
        <li>Runs: POST /api/agent/sessions/&#123;id&#125;/runs + resume</li>
        <li>SSE: GET /api/agent/sessions/&#123;id&#125;/stream</li>
        <li>Knowledge retrieval client uses sunmoonai-research-knowledge-retrieve</li>
      </ul>
    </section>
  )
}
