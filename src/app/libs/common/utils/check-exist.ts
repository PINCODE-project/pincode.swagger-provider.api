export const isExistById = async (entity: any, id: string) => {
    return await entity.findUnique({
        where: {
            id: id,
        },
    });
};
