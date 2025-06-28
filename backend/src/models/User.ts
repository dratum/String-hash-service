import pool from '../config/database';

export interface User {
  id?: number;
  external_id: string;
  provider: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(userData: User): Promise<User> {
    const { external_id, provider, name, email, avatar_url } = userData;

    const query = `
      INSERT INTO users (external_id, provider, name, email, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [external_id, provider, name, email, avatar_url];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findByExternalId(
    external_id: string,
    provider: string
  ): Promise<User | null> {
    const query =
      'SELECT * FROM users WHERE external_id = $1 AND provider = $2';
    const result = await pool.query(query, [external_id, provider]);

    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async update(
    id: number,
    userData: Partial<User>
  ): Promise<User | null> {
    const { name, email, avatar_url, is_active } = userData;

    const query = `
      UPDATE users 
      SET name = COALESCE($1, name), 
          email = COALESCE($2, email), 
          avatar_url = COALESCE($3, avatar_url), 
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [name, email, avatar_url, is_active, id];
    const result = await pool.query(query, values);

    return result.rows[0] || null;
  }
}
