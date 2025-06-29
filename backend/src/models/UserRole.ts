import pool from '../config/database';

export interface UserRole {
  id?: number;
  user_id: number;
  role_id: number;
  created_at?: Date;
}

export interface Role {
  id: number;
  name: string;
}

export class UserRoleModel {
  static async getUserRole(user_id: number): Promise<Role | null> {
    const query = `
      SELECT r.id, r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;
    
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null;
  }

  static async isAdmin(user_id: number): Promise<boolean> {
    const role = await this.getUserRole(user_id);
    return role?.name === 'admin';
  }

  static async createDefaultRole(user_id: number): Promise<void> {
    // Получаем ID роли 'user'
    const roleQuery = `SELECT id FROM roles WHERE name = 'user'`;
    const roleResult = await pool.query(roleQuery);
    
    if (roleResult.rows.length === 0) {
      throw new Error('Role "user" not found in database');
    }
    
    const roleId = roleResult.rows[0].id;
    
    // Создаем связь пользователя с ролью
    const insertQuery = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, role_id) DO NOTHING
    `;
    
    await pool.query(insertQuery, [user_id, roleId]);
  }
} 