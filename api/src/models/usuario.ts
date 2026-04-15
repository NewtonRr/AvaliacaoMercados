import { DataTypes, Model, Optional } from "sequelize";
import database from "../db/db.ts";

type UsuarioAttributes = {
  id: number;
  email: string;
  senha: string;
  idLoja: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
};

type UsuarioCreationAttributes = Optional<UsuarioAttributes, "id">;

class  Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: number;
  public email!: string;
  public senha!: string;
  public idLoja!: string;
  public role!: "user" | "admin";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
  },
  {
    sequelize: database,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;