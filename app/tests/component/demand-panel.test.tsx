import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DemandPanel } from '@/features/demand'
import messages from '@/messages/zh-CN.json'

// 后端按代码汇总好的样子（investment-backend `admin/missing_data.py`）
const summary = {
  items: [
    {
      security_code: '600036',
      market: null,
      times: 1,
      users: 1,
      last_at: '2026-10-07T04:30:00Z',
      datasets: [],
    },
    {
      security_code: '600519',
      market: 'sh',
      times: 3,
      users: 2,
      last_at: '2026-10-07T04:20:00Z',
      datasets: ['sh600519-financials', 'sh600519-prices'],
    },
  ],
}
let answer: () => Response

beforeEach(() => {
  answer = () => Response.json(summary)
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string, init: RequestInit = {}) => {
      expect(init.method ?? 'GET').toBe('GET')
      expect(String(input)).toBe('/api/admin/v1/workbench/missing-data')
      return answer()
    }),
  )
})
afterEach(() => vi.unstubAllGlobals())

function page(infoAdminUrl: string | null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <NextIntlClientProvider locale="zh-CN" messages={messages} timeZone="Asia/Shanghai">
      <QueryClientProvider client={client}>
        <DemandPanel infoAdminUrl={infoAdminUrl} />
      </QueryClientProvider>
    </NextIntlClientProvider>,
  )
}

describe('缺数据的需求', () => {
  it('每家公司一行：几次、几个人、最近一次、被查的数据集；一键去 info 管理端发起', async () => {
    page('https://info-admin.example.test')
    const table = await screen.findByRole('table', { name: '缺数据的需求' })
    const rows = within(table).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(2)
    const moutai = within(rows[1])
    expect(moutai.getByText('600519')).toBeInTheDocument()
    expect(moutai.getByText('SH')).toBeInTheDocument()
    expect(moutai.getByText('3')).toBeInTheDocument()
    expect(moutai.getByText('2')).toBeInTheDocument()
    expect(moutai.getByText('2026年10月7日 12:20')).toBeInTheDocument()
    expect(moutai.getByText('sh600519-financials, sh600519-prices')).toBeInTheDocument()
    const link = moutai.getByRole('link', { name: '去发起采集' })
    expect(link).toHaveAttribute(
      'href',
      'https://info-admin.example.test/zh-CN/info/securities?code=600519',
    )
    expect(link).toHaveAttribute('target', '_blank')
    // 专家交回说没入库的：没有数据集名，不留空
    expect(within(rows[0]).getByText('（专家交回说没入库）')).toBeInTheDocument()
  })

  it('info 管理端的地址没配：说明原因，只列代码，不给点不了的链接', async () => {
    page(null)
    await screen.findByRole('table', { name: '缺数据的需求' })
    expect(screen.getByText(/INFO_ADMIN_URL/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '去发起采集' })).toBeNull()
  })

  it('还没有人查不到：说一句，不画空表', async () => {
    answer = () => Response.json({ items: [] })
    page('https://info-admin.example.test')
    expect(await screen.findByRole('status')).toHaveTextContent('还没有人查不到数据。')
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('取不到：说没有取到', async () => {
    answer = () => new Response('{}', { status: 503 })
    page('https://info-admin.example.test')
    expect(await screen.findByRole('alert')).toHaveTextContent('没有取到，请稍后再试。')
  })
})
