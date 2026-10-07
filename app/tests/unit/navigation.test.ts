import { describe, expect, it } from 'vitest'
import { filterNavigationByRoles, findNavigationItem } from '@/lib/navigation'

describe('admin navigation', () => {
  it('uses the same metadata for role filtering and locale-aware route matching', () => {
    expect(filterNavigationByRoles([]).map((item) => item.key)).toEqual(['dashboard', 'settings'])
    expect(filterNavigationByRoles(['operator']).map((item) => item.key)).toContain('reference')
    expect(filterNavigationByRoles(['operator']).map((item) => item.key)).not.toContain(
      'rich-reference',
    )
    expect(filterNavigationByRoles(['admin']).map((item) => item.key)).toContain('rich-reference')
    expect(findNavigationItem('/zh-CN/reference/details')?.key).toBe('reference')
    // 缺数据的需求（账 56）：管理员与运营都看得到
    for (const role of ['admin', 'operator']) {
      expect(filterNavigationByRoles([role]).map((item) => item.key)).toContain(
        'workbench-missing-data',
      )
    }
    expect(findNavigationItem('/zh-CN/workbench/missing-data')?.key).toBe('workbench-missing-data')
  })
})
