'use client'

import { useFormatter, useLocale, useTranslations } from 'next-intl'

import { useMissingData } from '../api/demand'
import { ingestionHref, marketLabel } from '../model/demand'

// 缺数据的需求（账 56）：各用户查不到数据的公司，按代码汇总；采不采由我们定，采集在 info 管理端发起。
export function DemandPanel({ infoAdminUrl }: { infoAdminUrl: string | null }) {
  const t = useTranslations('demand')
  const format = useFormatter()
  const locale = useLocale()
  const demand = useMissingData()
  const when = (at: string) =>
    format.dateTime(new Date(at), { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <section className="reference-card" aria-label={t('title')}>
      <p className="reference-notice">{infoAdminUrl ? t('howToStart') : t('infoAdminUnset')}</p>
      {demand.isPending ? <p className="crud-state">{t('loading')}</p> : null}
      {demand.isError ? (
        <p role="alert" className="crud-error">
          {t('failed')}
        </p>
      ) : null}
      {demand.data && demand.data.length === 0 ? (
        <p role="status" className="crud-state">
          {t('none')}
        </p>
      ) : null}
      {demand.data && demand.data.length > 0 ? (
        <div className="crud-table-wrap">
          <table className="crud-table">
            <caption className="sr-only">{t('title')}</caption>
            <thead>
              <tr>
                <th>{t('code')}</th>
                <th>{t('times')}</th>
                <th>{t('users')}</th>
                <th>{t('lastAt')}</th>
                <th>{t('datasets')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {demand.data.map((item) => {
                const href = ingestionHref(infoAdminUrl, locale, item.security_code)
                return (
                  <tr key={item.security_code}>
                    <td className="font-mono">
                      {item.security_code}
                      {item.market ? (
                        <span className="text-muted-foreground ml-1 text-xs">
                          {marketLabel(item.market)}
                        </span>
                      ) : null}
                    </td>
                    <td>{item.times}</td>
                    <td>{item.users}</td>
                    <td>{when(item.last_at)}</td>
                    <td className="font-mono text-xs">
                      {item.datasets.length ? item.datasets.join(', ') : t('noDataset')}
                    </td>
                    <td>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="secondary-button"
                        >
                          {t('start')}
                        </a>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
