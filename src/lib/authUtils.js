// src/lib/authUtils.js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Hashing speed/security level

/**
 * Password ko hash karke return karta hai.
 * @param {string} password - User ka plain text password.
 * @returns {Promise<string>} - Hashed password.
 */
export async function hashPassword(password) {
  if (!password) {
    throw new Error("Password cannot be empty.");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Plain text password ko hashed password se compare karta hai.
 * @param {string} plainPassword - User ka input password.
 * @param {string} hashedPassword - Database se mila hashed password.
 * @returns {Promise<boolean>} - True agar match ho jaye.
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}