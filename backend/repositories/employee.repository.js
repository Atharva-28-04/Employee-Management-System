import prisma from '../config/prismaClient.js';
import cache from '../utils/cache.js';

const create = async (employeeData) => {
    return await prisma.employee.create({
        data: employeeData,
        include: { user: true, department: true }
    });
};

const findAll = async (whereClause, skip, take, orderBy) => {
    const cacheKey = `employees_${JSON.stringify(whereClause)}_${skip}_${take}`;

    // 1. Check if data exists in cache
   // const cachedData = cache.get(cacheKey);
   // if (cachedData) {
       // console.log('✅ Serving from cache');
      //  return cachedData;
  //  }

    // 2. If not in cache, fetch from database
const employees = await prisma.employee.findMany({
  where: whereClause,
  skip: skip,
  take: take,
  orderBy: orderBy,
  include: {
    user: {
      select: {
        name: true,
        email: true,
        role: true
      }
    },
    department: true,
    skills: {
      include: {
        skill: true
      }
    }
  }
});

    const totalRecords = await prisma.employee.count({ where: whereClause });
    const result = { employees, totalRecords };

    // 3. Save to cache for next time
    cache.set(cacheKey, result);
    console.log('📦 Saved to cache');

    return result;
};

const update = async (id, updatedData) => {
    // Clear cache when data changes
    cache.flushAll();
    return await prisma.employee.update({
        where: { id: parseInt(id) },
        data: updatedData
    });
};

const remove = async (id) => {
    // Clear cache when data changes
    cache.flushAll();
    return await prisma.employee.delete({
        where: { id: parseInt(id) }
    });
};

export default {
    create,
    findAll,
    update,
    remove
};