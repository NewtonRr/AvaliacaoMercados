import { DataTypes, Model } from 'sequelize';
import database from "../db/db.ts";

export class Response extends Model {}

Response.init(
  {
    tabId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize: database, tableName: 'responses' }
);