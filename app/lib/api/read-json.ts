// 管理接口的只读收发。同源 /api/admin；答复一律过 zod。
import { z } from 'zod'

export class AdminReadError extends Error {
  constructor(
    public readonly code:
      | 'not_found'
      | 'backend_unavailable'
      | 'contract_invalid'
      | 'request_failed',
    public readonly status?: number,
  ) {
    super(code)
    this.name = 'AdminReadError'
  }
}

export async function readJson<T>(schema: z.ZodType<T>, path: string): Promise<T> {
  if (!path.startsWith('/api/admin/')) throw new Error('admin path expected')
  let response: Response
  try {
    response = await fetch(path, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      redirect: 'manual',
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new AdminReadError('backend_unavailable')
  }
  if (!response.ok || response.type === 'opaqueredirect') {
    throw new AdminReadError(
      response.status === 404 ? 'not_found' : 'request_failed',
      response.status,
    )
  }
  const parsed = schema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) throw new AdminReadError('contract_invalid', response.status)
  return parsed.data
}

export const seg = (value: string) => encodeURIComponent(value)
