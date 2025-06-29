import pool from '../config/database';

export interface User {
  id?: number;
  external_id: string;
  provider: string;
  name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(userData: User): Promise<User> {
    const { external_id, provider, name, email } = userData;

    const query = `
                  INSERT INTO users 
                                  (
                        external_id
                      , provider
                      , name
                      , email
                                  )
                  VALUES 
                                  (
                        $1
                      , $2
                      , $3
                      , $4
                                  )
                  RETURNING *
      `;

    const values = [external_id, provider, name, email];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findByExternalId(
    external_id: string,
    provider: string
  ): Promise<User | null> {
    const query = `
                  SELECT * FROM users
                  WHERE external_id = $1
                  AND provider = $2
    `;
    const result = await pool.query(query, [external_id, provider]);

    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `
                  SELECT * FROM users
                  WHERE email = $1
    `;
    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = `
                   SELECT * FROM users
                   WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async update(
    id: number,
    userData: Partial<User>
  ): Promise<User | null> {
    const { name, email, is_active } = userData;

    const query = `
                  UPDATE users 
                  SET name = COALESCE($1, name)
                    , email = COALESCE($2, email)
                    , is_active = COALESCE($3, is_active)
                    , updated_at = CURRENT_TIMESTAMP
                  WHERE id = $4
                  RETURNING *
    `;

    const values = [name, email, is_active, id];
    const result = await pool.query(query, values);

    return result.rows[0] || null;
  }
}
