// 缺数据的需求的契约（账 56）。字段以 investment-backend `interfaces/http/admin/missing_data.py` 为真源。
import { z } from 'zod'

export const missingDataItemSchema = z
  .object({
    security_code: z.string(),
    market: z.string().nullable(),
    // 查过几次、几个人；最近一次什么时候；被查的数据集名（专家说没入库的没有数据集名）
    times: z.number().int(),
    users: z.number().int(),
    last_at: z.string(),
    datasets: z.array(z.string()),
  })
  .loose()
export type MissingDataItem = z.infer<typeof missingDataItemSchema>

export const missingDataListSchema = z.object({ items: z.array(missingDataItemSchema) }).loose()
