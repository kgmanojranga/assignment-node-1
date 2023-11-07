import mysql, { ResultSetHeader } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

type NoteType = {
  id: number;
  title: string;
  contents: string;
  created: string;
};

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM notes");

  return rows;
}

export async function getNote(id: number | string): Promise<NoteType> {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM notes
  WHERE id=?
  `,
    [id]
  );

  return (rows as NoteType[])[0];
}

export async function createNote(title: string, content: string) {
  const [result] = await pool.query(
    `
  INSERT INTO notes (title, contents)
  VALUES (?, ?)
  `,
    [title, content]
  );

  const id = (result as ResultSetHeader).insertId;

  return getNote(id);

  // return { id, title, content };
}

// async function main() {
//   const result = await createNote("test", "test");
//   console.log(result);
// }

// main();
