import prisma from '../config/prismaClient.js';

// GET ALL NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const notifications =
      await prisma.notification.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// CREATE NOTIFICATION
export const createNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await prisma.notification.create({
        data: {
          user_id: req.body.user_id,
          title: req.body.title,
          message: req.body.message
        }
      });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// MARK AS READ
export const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await prisma.notification.update({
        where: {
          id: parseInt(req.params.id)
        },
        data: {
          is_read: true
        }
      });

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};