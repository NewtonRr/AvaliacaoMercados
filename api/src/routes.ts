import { Router } from "express";
import criarUserRouter from "./modules/criarUser/criarUser.ts";
import authRouter from "./modules/login/auth.ts";
import Avaliacao from "./models/avaliacao.ts";
import { authenticate } from "./middlewares/authorization.ts";
import CategoriaAvaliacao from "./models/categoriaAvaliação.ts";

const router = Router();

router.use("/", criarUserRouter);
router.use("/", authRouter);

// Busca tabs da loja
router.get("/:idLoja/tabs", async (req, res) => {
    const tabs = await CategoriaAvaliacao.findAll({
        where: { idLoja: req.params.idLoja },
        order: [["order", "ASC"]]
    });
    return res.json(tabs);
});

// Cria ou atualiza tab (upsert)
router.post("/:idLoja/tabs", authenticate, async (req, res) => {
    const tab = req.body;
    const [record] = await CategoriaAvaliacao.upsert({ ...tab, idLoja: req.params.idLoja });
    return res.status(201).json(record);
});

// Remove tab
router.delete("/:idLoja/tabs/:id", authenticate, async (req, res) => {
    await CategoriaAvaliacao.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Removida." });
});

// Salva resposta (público)
router.post("/:idLoja/responses", async (req, res) => {
    console.log("body recebido:", req.body);
    const response = await Avaliacao.create({ ...req.body, idLoja: req.params.idLoja });
    return res.status(201).json(response);
});

// Busca respostas (dashboard)
router.get("/:idLoja/responses", authenticate, async (req, res) => {
    const responses = await Avaliacao.findAll({ where: { idLoja: req.params.idLoja } });
    return res.json(responses);
});

export default router;