import { getDrizzleInstance } from '@/core/index'

export class BaseService {
  protected readonly db

  constructor(private readonly d1Database: D1Database) {
    this.db = getDrizzleInstance(d1Database)
  }
}
