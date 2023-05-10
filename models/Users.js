module.exports = (sequelize, DataTypes) => {
    var Users = sequelize.define('Users',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: DataTypes.STRING(36),
                allowNull: false,
                unique: true,
            },
            group: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );
    return Users;
};

