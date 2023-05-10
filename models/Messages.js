module.exports = (sequelize, DataTypes) => {
    var Messages = sequelize.define('Messages',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            messageID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
            },
            conversationID: DataTypes.UUID,
            senderID: DataTypes.UUID,
            messageType: DataTypes.STRING,
            content: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );
    return Messages;
};

