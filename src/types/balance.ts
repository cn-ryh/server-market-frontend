// 账户余额类型
export interface BalanceData {
  total: number
  available: number
  frozen: number
}

// 提现记录类型
export interface WithdrawRecord {
  id: string
  date: string
  amount: number
  fee: number
  status: 'pending' | 'success' | 'failed' | 'processing'
}