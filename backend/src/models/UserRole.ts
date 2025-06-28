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
      SELECT r.id, r.name,
      FROM user_role ur
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
} 