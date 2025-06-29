import pool from '../config/database';

export interface HashRequest {
  id?: number;
  user_id?: number;
  algorithm_id?: number;
  input_string: string;
  hash_result: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

export interface HashHistoryItem {
  id: number;
  algorithm_name: string;
  input_string: string;
  hash_result: string;
  created_at: string;
}

export class HashRequestModel {
  static async create(hashRequest: HashRequest): Promise<HashRequest> {
    const {
      user_id,
      algorithm_id,
      input_string,
      hash_result,
      ip_address,
      user_agent,
    } = hashRequest;

    const query = `
      INSERT INTO hash_requests (
        user_id,
        algorithm_id,
        input_string,
        hash_result,
        ip_address,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      user_id,
      algorithm_id,
      input_string,
      hash_result,
      ip_address,
      user_agent,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAlgorithmId(algorithmName: string): Promise<number> {
    const query = `
      SELECT id FROM hash_algorithms 
      WHERE name = $1 AND is_active = true
    `;

    const result = await pool.query(query, [algorithmName]);

    if (result.rows.length === 0) {
      throw new Error(`Algorithm ${algorithmName} not found or inactive`);
    }

    return result.rows[0].id;
  }

  static async findByUserId(
    userId: number,
    limit: number = 50
  ): Promise<HashHistoryItem[]> {
    const query = `
      SELECT 
        hr.id,
        ha.name as algorithm_name,
        hr.input_string,
        hr.hash_result,
        hr.created_at
      FROM hash_requests hr
      JOIN hash_algorithms ha ON hr.algorithm_id = ha.id
      WHERE hr.user_id = $1
      ORDER BY hr.created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }
}
