
import * as SQLite from "expo-sqlite";

let db = null;

async function obterBanco() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("meuBanco.db");
  }

  return db;
}

export async function initDatabase() {
  try {
    const banco = await obterBanco();

    await banco.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        pontos INTEGER DEFAULT 0
      );
    `);

    return banco;
  } catch (error) {
    console.error("Erro ao inicializar o banco:", error);
    throw error;
  }
}

export async function cadastrarUsuarioDB(nome, email, senha) {
  try {
    const banco = await initDatabase();

    const nomeLimpo = String(nome || "").trim();
    const emailLimpo = String(email || "").trim().toLowerCase();
    const senhaLimpa = String(senha || "");

    if (!nomeLimpo || !emailLimpo || !senhaLimpa) {
      throw new Error("Preencha todos os campos.");
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await banco.getFirstAsync(
      `
      SELECT id
      FROM usuarios
      WHERE email = ?
      `,
      [emailLimpo]
    );

    if (usuarioExistente) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const result = await banco.runAsync(
      `
      INSERT INTO usuarios
        (nome, email, senha, pontos)
      VALUES
        (?, ?, ?, ?)
      `,
      [nomeLimpo, emailLimpo, senhaLimpa, 0]
    );

    return result;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
}

export async function verificarLoginDB(email, senha) {
  try {
    const banco = await initDatabase();

    const emailLimpo = String(email || "").trim().toLowerCase();
    const senhaLimpa = String(senha || "");

    const usuario = await banco.getFirstAsync(
      `
      SELECT
        id,
        nome,
        email,
        senha,
        pontos
      FROM usuarios
      WHERE email = ?
        AND senha = ?
      `,
      [emailLimpo, senhaLimpa]
    );

    return usuario;
  } catch (error) {
    console.error("Erro ao verificar login:", error);
    throw error;
  }
}
