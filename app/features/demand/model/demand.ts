// 缺数据的需求：状态与算法，不取数、不渲染。

// 去 info 管理端的「证券采集」页发起采集：那一页认地址里的 code，填好代码等着按「发起」。
// info 管理端的地址没配就是 null：页面只给代码，不给一个点不了的链接
export function ingestionHref(infoAdminUrl: string | null, locale: string, code: string) {
  if (!infoAdminUrl) return null
  const base = infoAdminUrl.replace(/\/+$/, '')
  return `${base}/${encodeURIComponent(locale)}/info/securities?code=${encodeURIComponent(code)}`
}

// 列表里显示的市场：没认出市场的（专家交回说没入库）不猜
export function marketLabel(market: string | null) {
  return market ? market.toUpperCase() : ''
}
