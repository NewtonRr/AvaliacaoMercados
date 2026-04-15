import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../../models/usuario.ts";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body as {
      email?: string;
      senha?: string;
    };

    if (!email || !senha) {
      return res.status(400).json({ error: "email e senha sao obrigatorios" });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "credenciais invalidas" });
    }

    const senhaHash = usuario.getDataValue("senha");
    if (!senhaHash) {
      return res.status(401).json({ error: "credenciais invalidas" });
    }

    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: "credenciais invalidas" });
    }

    const usuarioData = usuario.toJSON() as {
      id?: number;
      email?: string;
      idLoja?: string;
      role?: "user" | "admin";
    };

    const id = usuarioData.id ?? usuario.getDataValue("id");
    const userEmail = usuarioData.email ?? usuario.getDataValue("email");
    const idLoja = usuarioData.idLoja ?? usuario.getDataValue("idLoja");
    const role = (usuarioData.role ?? usuario.getDataValue("role") ?? "user") as "user" | "admin";

    if (!id || !userEmail || !idLoja) {
      return res.status(500).json({ error: "dados de usuario incompletos para gerar token" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign(
      {
        id,
        email: userEmail,
        idLoja,
        role,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      usuario: {
        id,
        email: userEmail,
        idLoja,
        role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "erro interno no login" });
  }
});

export default authRouter;