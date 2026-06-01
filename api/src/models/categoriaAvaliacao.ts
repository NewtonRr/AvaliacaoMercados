import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.ts";

class CategoriaAvaliacao extends Model {}

CategoriaAvaliacao.init({
    id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    idLoja:       { type: DataTypes.STRING, allowNull: false },
    title:        { type: DataTypes.STRING, allowNull: false },
    description:  { type: DataTypes.STRING },
    questionText: { type: DataTypes.STRING, allowNull: false },
    scaleType:    { type: DataTypes.ENUM("faces", "stars"), defaultValue: "faces" },
    maxScore:     { type: DataTypes.INTEGER, defaultValue: 3 },
    color:        { type: DataTypes.STRING },
    order:        { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: "categorias_avaliacao" });

export default CategoriaAvaliacao;