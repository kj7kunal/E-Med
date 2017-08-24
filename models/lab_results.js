module.exports = function(sequelize, DataTypes) {
  var LabResult = sequelize.define("lab_results", {
    test_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 45]
      }
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    test_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  LabResult.associate = (models) => {
    LabResult.belongsTo(models.patient, {
      foreignKey: {
          allowNull: false,
      }
  })
  }
  return LabResult;
};
