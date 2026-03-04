import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';
import { eventCategories, language, roles } from '../../src/utils/constant/enums.js';

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(roles)),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(language))),
      allowNull: false,
    },
    eventCategories: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(eventCategories))),
      allowNull: false,
    },
    portfolio: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    // portfolio picture avatar default picture
    portfolioPicture: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // admin verification
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  },
);

// ✅ Hide password from JSON responses
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};
