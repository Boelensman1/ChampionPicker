module.exports = function(sequelize, DataTypes) {
  var championSplash = sequelize.define('championSplash', {
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        championSplash.belongsTo(models.champion, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return championSplash;
};
