'use client'

import { useQuery } from '@tanstack/react-query'

import { missingDataListSchema } from '@/contracts/missing-data'
import { readJson } from '@/lib/api/read-json'

// 各用户在对话里查不到数据的公司，后端按代码汇总好了
export function useMissingData() {
  return useQuery({
    queryKey: ['workbench', 'missing-data'],
    queryFn: async () =>
      (await readJson(missingDataListSchema, '/api/admin/v1/workbench/missing-data')).items,
  })
}
