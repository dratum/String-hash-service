import pool from '../config/database';

export interface AuthLog {
  id?: number;
  user_id?: number;
  action: string;
  provider?: string;
  ip_address?: string;
  user_agent?: string;
  success?: boolean;
  error_message?: string;
  created_at?: Date;
}

export class AuthLogModel {
  static async create(logData: AuthLog): Promise<AuthLog> {
    const {
      user_id,
      action,
      provider,
      ip_address,
      user_agent,
      success,
      error_message,
    } = logData;

    const query = `
      INSERT INTO auth_logs (user_id, action, provider, ip_address, user_agent, success, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user_id,
      action,
      provider,
      ip_address,
      user_agent,
      success,
      error_message,
    ];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findByUserId(user_id: number): Promise<AuthLog[]> {
    const query =
      'SELECT * FROM auth_logs WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [user_id]);

    return result.rows;
  }

  static async findRecent(limit: number = 100): Promise<AuthLog[]> {
    const query = 'SELECT * FROM auth_logs ORDER BY created_at DESC LIMIT $1';
    const result = await pool.query(query, [limit]);

    return result.rows;
  }
}
