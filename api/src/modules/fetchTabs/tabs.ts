import { Router } from "express";
import authenticate from "../../middlewares/authorization";
import Avaliacao from "../../models/avaliacao";
import CategoriaAvaliacao from "../../models/categoriaAvaliacao";

const tabsRouter = Router();
// Busca tabs da loja
tabsRouter.get("/:idLoja/tabs", async (req, res) => {
    const tabs = await CategoriaAvaliacao.findAll({
        where: { idLoja: req.params.idLoja },
        order: [["order", "ASC"]]
    });
    return res.json(tabs);
});

// Cria ou atualiza tab
tabsRouter.post("/:idLoja/tabs", authenticate, async (req, res) => {
    const tab = req.body;
    const [record] = await CategoriaAvaliacao.upsert({ ...tab, idLoja: req.params.idLoja });
    return res.status(201).json(record);
});

// Remove tab
tabsRouter.delete("/:idLoja/tabs/:id", authenticate, async (req, res) => {
    await CategoriaAvaliacao.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Removida." });
});

// Salva resposta
tabsRouter.post("/:idLoja/responses", async (req, res) => {
    console.log("body recebido:", req.body);
    const response = await Avaliacao.create({ ...req.body, idLoja: req.params.idLoja });
    return res.status(201).json(response);
});

// Busca respostas
tabsRouter.get("/:idLoja/responses", authenticate, async (req, res) => {
    const responses = await Avaliacao.findAll({ where: { idLoja: req.params.idLoja } });
    return res.json(responses);
});

tabsRouter.post("/:idLoja/responses/batch", async (req, res) => {
    const { scores } = req.body;

    if (!Array.isArray(scores) || scores.length === 0) {
        return res.status(400).json({ error: "scores deve ser um array não vazio" });
    }

    const createdAt = new Date();

    await Avaliacao.bulkCreate(
        scores.map(({ tabId, score }) => ({
            tabId,
            score,
            createdAt,
            idLoja: req.params.idLoja,
        }))
    );

    return res.status(201).json({ inserted: scores.length });
});

export default tabsRouter;