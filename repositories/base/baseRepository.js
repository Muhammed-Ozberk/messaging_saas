const { Op } = require("sequelize");
module.exports = {

    create: async (table, data) => {
        return await table.create(data);
    },

    update: async (table, data, where) => {
        return await table.update(data, { where: where });
    },

    upsert: async (table, data) => {
        return await table.create(data, {
            updateOnDuplicate: [
                "updatedAt"
            ]
        });
    },

    findOne: async (table, where) => {
        return await table.findOne({ where: where });
    },

    findOneOr: async (table, where) => {
        return await table.findOne({
            where: {
                [Op.or]: where
            }
        });
    },

    findAllWithPaginationAndOrder: async (table, where, limit, order) => {
        return await table.findAll({ where: where, limit: limit, order: order });
    },

}