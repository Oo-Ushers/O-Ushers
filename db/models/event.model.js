import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';
import { eventStatus, genderPreference, eventCategories } from '../../src/utils/constant/enums.js';

export const Event = sequelize.define(
  'Event',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(eventCategories)),
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiredCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genderPreference: {
      type: DataTypes.ENUM(...Object.values(genderPreference)),
      defaultValue: 'any',
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dressCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(eventStatus)),
      defaultValue: 'open',
    },
    hiredTalents: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
    // Optional supervisor assigned to this event (must be organizer-staff role)
    supervisorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    timestamps: true,
    tableName: 'events',
  },
);
