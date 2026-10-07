import { describe, expect, it } from 'vitest'

import { ingestionHref, marketLabel } from '@/features/demand/model/demand'

describe('去 info 管理端发起采集的链接', () => {
  it('带着语言与代码去「证券采集」页；地址末尾的斜杠不重复', () => {
    expect(ingestionHref('https://info-admin.example.test', 'zh-CN', '600519')).toBe(
      'https://info-admin.example.test/zh-CN/info/securities?code=600519',
    )
    expect(ingestionHref('https://info-admin.example.test/', 'en', '000001')).toBe(
      'https://info-admin.example.test/en/info/securities?code=000001',
    )
  })

  it('info 管理端的地址没配：没有链接', () => {
    expect(ingestionHref(null, 'zh-CN', '600519')).toBeNull()
    expect(ingestionHref('', 'zh-CN', '600519')).toBeNull()
  })

  it('市场只在认出来时显示', () => {
    expect(marketLabel('sh')).toBe('SH')
    expect(marketLabel(null)).toBe('')
  })
})
