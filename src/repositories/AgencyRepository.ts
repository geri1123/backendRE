import pool from '../config/db';
import { Agency } from '../types/auth';
import { generatePublicCode } from '../utils/hash';

export class AgencyRepository {
  static async licenseExists(license: string): Promise<boolean> {
    const [rows] = await pool.execute('SELECT 1 FROM agencies WHERE license_number = ?', [license]);
    return (rows as any[]).length > 0;
  }
  
  static async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute('SELECT 1 FROM agencies WHERE email = ?', [email]);
    return (rows as any[]).length > 0;
  }
  
  static async findByPublicCode(publicCode: string): Promise<Agency | null> {
    const [rows] = await pool.execute('SELECT * FROM agencies WHERE public_code = ?', [publicCode]);
    return (rows as Agency[])[0] || null;
  }
   static async agencyNameExist(agency_name:string):Promise<boolean>{
    const [rows]=await pool.execute('SELECT 1 FROM agencies WHERE agency_name=?' , [agency_name]);
    return (rows as any[]).length>0;
  }
  static async create(agencyData: {
    agency_name: string;
    license_number: string;
    // email?: string;
    phone?: string;
    address?: string;
   
  }): Promise<number> {
    let publicCode: string;
    
    // Generate unique public code
    do {
      publicCode = generatePublicCode();
    } while (await this.publicCodeExists(publicCode));
    
    const [result] = await pool.execute(
      `INSERT INTO agencies 
       (agency_name, public_code, license_number, agency_email,  address, status)
       VALUES (?, ?, ?, ?, ?, 'inactive')`,
      [
        agencyData.agency_name,
        publicCode,
        agencyData.license_number,
        // agencyData.email,
        agencyData.phone || null,
        agencyData.address || null,
        
      ]
    );
    
    return (result as any).insertId;
  }
  
  private static async publicCodeExists(publicCode: string): Promise<boolean> {
    const [rows] = await pool.execute('SELECT 1 FROM agencies WHERE public_code = ?', [publicCode]);
    return (rows as any[]).length > 0;
  }
}