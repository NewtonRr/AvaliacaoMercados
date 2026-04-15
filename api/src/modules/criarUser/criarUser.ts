import { Router } from "express";
import bcrypt from "bcrypt";
import { ValidationError } from "sequelize";
import Usuario from "../../models/usuario.ts";
import { authenticate, authorizeRoles } from "../../middlewares/authorization.ts";

const criarUserRouter = Router();

criarUserRouter.post("/usuarios", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { email, senha, idLoja, role } = req.body as {
      email?: string;
      senha?: string;
      idLoja?: string;
      role?: string;
    };

    if (!email || !senha || !idLoja || !role) {
      return res.status(400).json({ error: "email, senha, idLoja e role sao obrigatorios" });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const idLojaNormalizado = idLoja.trim();
    const roleNormalizado = role.trim().toLowerCase();

    if (!emailNormalizado || !idLojaNormalizado || !roleNormalizado) {
      return res.status(400).json({ error: "email, senha, idLoja e role sao obrigatorios" });
    }

    if (!["user", "admin"].includes(roleNormalizado)) {
      return res.status(400).json({ error: "role invalido" });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: "senha deve ter no minimo 6 caracteres" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (usuarioExistente) {
      return res.status(409).json({ error: "email ja cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      email: emailNormalizado,
      senha: senhaHash,
      idLoja: idLojaNormalizado,
      role: roleNormalizado as "user" | "admin",
    });

    return res.status(201).json({
      id: novoUsuario.id,
      email: novoUsuario.email,
      idLoja: novoUsuario.idLoja,
      role: novoUsuario.role,
      createdAt: novoUsuario.createdAt,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: "dados invalidos para criar usuario" });
    }

    console.error("Erro ao criar usuario:", error);
    return res.status(500).json({ error: "erro interno ao criar usuario" });
  }
});

export default criarUserRouter;
 