import prisma from '../config/prismaClient.js';

// ==========================================
// GET ALL ASSETS
// ==========================================
export const getAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(assets);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ==========================================
// CREATE ASSET
// ==========================================
export const createAsset = async (req, res) => {
  try {
    const asset = await prisma.asset.create({
      data: {
        asset_code: req.body.asset_code,
        asset_name: req.body.asset_name,
        asset_type: req.body.asset_type,
        purchase_date: req.body.purchase_date
          ? new Date(req.body.purchase_date)
          : null,
        purchase_cost: req.body.purchase_cost
          ? Number(req.body.purchase_cost)
          : null
      }
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ==========================================
// ALLOCATE ASSET
// ==========================================
export const allocateAsset = async (req, res) => {
  try {
    const {
      assetId,
      employeeId,
      allocatedBy
    } = req.body;

    const allocation =
      await prisma.assetAllocation.create({
        data: {
          asset_id: parseInt(assetId),
          employee_id: parseInt(employeeId),
          allocated_by: parseInt(allocatedBy)
        }
      });

    await prisma.asset.update({
      where: {
        id: parseInt(assetId)
      },
      data: {
        status: 'Allocated'
      }
    });

    // AUDIT LOG
    await prisma.auditLog.create({
      data: {
        table_name: 'AssetAllocation',
        action_type: 'CREATE',
        record_id: allocation.id,
        new_data: allocation,
        performed_by: parseInt(allocatedBy)
      }
    });

    // NOTIFICATION
    await prisma.notification.create({
      data: {
        user_id: parseInt(employeeId),
        title: 'Asset Assigned',
        message: 'A company asset has been assigned to you.'
      }
    });

    res.json({
      message: 'Asset allocated successfully',
      allocation
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ==========================================
// RETURN ASSET
// ==========================================
export const returnAsset = async (req, res) => {
  try {
    const allocationId = parseInt(req.params.id);

    const allocation =
      await prisma.assetAllocation.update({
        where: {
          id: allocationId
        },
        data: {
          status: 'Returned',
          return_date: new Date()
        }
      });

    await prisma.asset.update({
      where: {
        id: allocation.asset_id
      },
      data: {
        status: 'Available'
      }
    });

    // AUDIT LOG
    await prisma.auditLog.create({
      data: {
        table_name: 'AssetAllocation',
        action_type: 'RETURN',
        record_id: allocation.id,
        new_data: allocation,
        performed_by: allocation.allocated_by
      }
    });

    // NOTIFICATION
    await prisma.notification.create({
      data: {
        user_id: allocation.employee_id,
        title: 'Asset Returned',
        message: 'Your asset return has been recorded.'
      }
    });

    res.json({
      message: 'Asset returned successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};