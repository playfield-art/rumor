import { DataTypes, Model } from "sequelize";
import Database from "../database";

/**
 * Create the internal LogItem Model
 */
class LogItem extends Model {
  declare id: string;

  declare time: Date;

  declare message: string;

  declare type: string;
}

/**
 * Init the Bee Model with sequelize
 */
LogItem.init(
  {
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: Database.getSequelize(),
    modelName: "LogItem",
    tableName: "log_items",
  }
);

/**
 * Sync the log items table
 */
LogItem.sync({ alter: true }).catch(() => {});

export default LogItem;
