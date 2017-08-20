module.exports = function(sequelize, DataTypes) {
  var Prescription = sequelize.define("prescriptions", {
    med_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 45]
      }
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prescribed_date: {
        type: DataTypes.DATEONLY
    },
    renew_date: {
        type: DataTypes.DATEONLY
    }
  });
  return Prescription;
};
