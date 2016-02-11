module.exports = function(sequelize, DataTypes) {
  var Position = sequelize.define('position', {
    position: DataTypes.STRING,
    played: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        Position.belongsTo(models.champion, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Position;
};
