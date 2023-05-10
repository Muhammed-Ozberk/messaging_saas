module.exports = (sequelize, DataTypes) => {
    var Conversations = sequelize.define('Conversations',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            conversationID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
            },
            userOne: DataTypes.UUID, 
            userTwo:  DataTypes.UUID, 
            seen: DataTypes.STRING, //String
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );
    return Conversations;
};

