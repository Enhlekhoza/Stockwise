import db from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define an interface for the User
export interface User {
  id?: number;
  username: string;
  password_hash: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

// Function to register a new user
export const registerUser = async (username: string, password_raw: string, email: string): Promise<User | null> => {
  try {
    const password_hash = await bcrypt.hash(password_raw, 10); // Hash the password
    const [newUser] = await db('users').insert({
      username,
      password_hash,
      email,
    }).returning('*');
    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};

// Function to log in a user and generate a JWT token
export const loginUser = async (username: string, password_raw: string): Promise<string | null> => {
  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      return null; // User not found
    }

    const isPasswordValid = await bcrypt.compare(password_raw, user.password_hash);
    if (!isPasswordValid) {
      return null; // Invalid password
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string, // JWT_SECRET should be in .env
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    return token;
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};
