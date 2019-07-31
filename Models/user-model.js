module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profile_pic_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        join_date: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return User
}