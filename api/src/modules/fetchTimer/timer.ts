import { Router, Request, Response } from "express";
import Usuario from "../../models/usuario.ts";
import { authenticate } from "../../middlewares/authorization.ts";

const timerRouter = Router();

timerRouter.get("/:idLoja/timer", authenticate, async (req, res) => {
  try {
    const user = await Usuario.findOne({ 
      where: { idLoja: req.params.idLoja },
      attributes: ["id", "timer"] 
    });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    return res.json({ timer: user.timer ?? null });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar timer" });
  }
});

timerRouter.patch("/:idLoja/timer", authenticate, async (req, res) => {
  try {
    const { timer } = req.body;

    if (typeof timer !== "number") {
      return res.status(400).json({ message: "Timer deve ser um número" });
    }

    const [updatedRows] = await Usuario.update(
      { timer },
      { where: { idLoja: req.params.idLoja } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json({ message: "Timer atualizado com sucesso", timer });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar timer" });
  }
});

export default timerRouter;