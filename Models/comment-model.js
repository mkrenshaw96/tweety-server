module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_img_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        repost_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        like_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Comment
}