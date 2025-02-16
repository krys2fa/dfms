import pool from "../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    return { success: true, time: rows[0].now };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
