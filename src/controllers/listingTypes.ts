// // File: controllers/listingTypes.ts
// import { Request, Response } from "express";
// import pool from "../db/index.js";

// import {
//   ListingType,
  
//   AddListingTypeRequestBody,

// } from "../types/listingTypes.js";
// interface ErrorResponse {
//   message: string;
// }

// export const getListingTypes = async (
//   req: Request,
//   res: Response<ListingType[] | ErrorResponse>
// ): Promise<void> => {
//   const langParam = req.language || "al";

//   try {
//     const [rows] = await pool.query(
//       `SELECT lt.id, ltt.name 
//        FROM listing_types lt
//        JOIN listing_type_translations ltt ON lt.id = ltt.listing_type_id
//        WHERE ltt.language_code = ?`,
//       [langParam]
//     );

//     res.json(rows as ListingType[]);
//   } catch (error) {
//     console.error("❌ Error fetching listing types:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// // POST /listing-types
// export const addListingType = async (
//   req: Request<{}, {}, AddListingTypeRequestBody>,
//   res: Response
// ): Promise<void> => {
//   const { translations } = req.body;

//   if (!Array.isArray(translations) || translations.length === 0) {
//     res.status(400).json({ message: "At least one translation is required" });
//     return;
//   }

//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     const [typeResult] = await conn.query("INSERT INTO listing_types () VALUES ()");
//     const insertId = (typeResult as any).insertId;

//     for (const t of translations) {
//       await conn.query(
//         `INSERT INTO listing_type_translations (listing_type_id, language_code, name)
//          VALUES (?, ?, ?)`,
//         [insertId, t.language_code, t.name]
//       );
//     }

//     await conn.commit();
//     res.status(201).json({ message: "Listing type added", id: insertId });
//   } catch (error) {
//     await conn.rollback();
//     console.error("❌ Error adding listing type:", error);
//     res.status(500).json({ message: "Internal server error" });
//   } finally {
//     conn.release();
//   }
// };
