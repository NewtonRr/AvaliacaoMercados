import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.ts";

class Avaliacao extends Model {}

Avaliacao.init({
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    idLoja:      { type: DataTypes.STRING, allowNull: false },
    tabId:       { type: DataTypes.UUID, allowNull: false }, // FK para CategoriaAvaliacao
    score:       { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
    comment:     { type: DataTypes.TEXT },
    createdAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: "avaliacoes" });

export default Avaliacao;