import * as SQLite from "expo-sqlite";

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync("meuBanco.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      pontos INTEGER DEFAULT 0
    );
  `);
}

export async function cadastrarUsuarioDB(nome, email, senha) {
  const db = await SQLite.openDatabaseAsync("meuBanco.db");
  const result = await db.runAsync(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha]
  );
  return result;
}

export async function verificarLoginDB(email, senha) {
  const db = await SQLite.openDatabaseAsync("meuBanco.db");
  const usuario = await db.getFirstAsync(
    "SELECT id, nome, email, senha, pontos FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha]
  );
  return usuario;
}