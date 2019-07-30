module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define('following', {
        following_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Following
}