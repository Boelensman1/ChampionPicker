module.exports = function(sequelize, DataTypes) {
  var championIcon = sequelize.define('championIcon', {
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        championIcon.belongsTo(models.champion, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return championIcon;
};
