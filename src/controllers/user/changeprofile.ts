import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import pool from '../../config/db.js';
import { getFullImageUrl } from '../../utils/imageUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function updateProfileImage(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  const newProfileImgPath = req.file ? `uploads/images/${req.file.filename}` : undefined;
  
  if (!newProfileImgPath) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [results] = await connection.query('SELECT profile_img FROM `users` WHERE id = ?', [userId]);
    
    if ((results as any[]).length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const currentProfileImgPath = (results as any)[0].profile_img;
    
    
    if (currentProfileImgPath && currentProfileImgPath.trim() !== '') {
     
      const projectRoot = path.resolve(__dirname, '..', '..', '..');
      const fullOldPath = path.resolve(projectRoot, currentProfileImgPath);
      
      console.log('Deleting old image at:', fullOldPath);
      
      try {
        await fs.unlink(fullOldPath);
        console.log('Old profile image deleted successfully');
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          console.warn('Old profile image not found for deletion:', fullOldPath);
        } else {
          console.error('Failed to delete old profile image:', err);
        }
      }
    } else {
      console.log('No existing profile image to delete, uploading new image');
    }
    
    await connection.query('UPDATE `users` SET profile_img = ? WHERE id = ?', [newProfileImgPath, userId]);
    
    const fullUrl = getFullImageUrl(newProfileImgPath, req);
    res.json({ success: true, profilePicture: fullUrl });
    
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
}