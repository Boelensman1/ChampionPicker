module.exports = function(sequelize, DataTypes) {
  var Link = sequelize.define('link', {//because Link is a reserved word
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Link.belongsTo(models.champion, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Link;
};
