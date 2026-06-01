import { DataTypes, Model, Optional } from "sequelize";
import database from "../db/db.ts";

type UsuarioAttributes = {
  id: number;
  email: string;
  senha: string;
  idLoja: string;
  role: "user" | "admin";
  timer?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type UsuarioCreationAttributes = Optional<UsuarioAttributes, "id">;

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  declare id: number;
  declare email: string;
  declare senha: string;
  declare idLoja: string;
  declare role: "user" | "admin";
  declare timer?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idLoja: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    timer: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;