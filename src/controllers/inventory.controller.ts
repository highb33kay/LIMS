import { Request, Response, NextFunction, RequestHandler } from "express";
import prisma from "../utils/prisma";
import { BadRequestError, NotFoundError } from "../middlewares/errorhandler";
import { ResponseHandler } from "../utils/responsehandler";

export const getAllItems: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve all inventory items from the database
    const inventoryItems = await prisma.inventoryItem.findMany();

    ResponseHandler.success(
      res,
      inventoryItems,
      200,
      "All inventory items retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getItemById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = parseInt(req.params.id, 10);

    // Retrieve a specific inventory item by ID from the database
    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    ResponseHandler.success(
      res,
      item,
      200,
      "Inventory item retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const addItem: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, quantity } = req.body;

    // Validation
    if (!name || !quantity) {
      throw new BadRequestError("Name and quantity are required");
    }

    // Create a new inventory item in the database
    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        quantity,
      },
    });

    ResponseHandler.success(
      res,
      newItem,
      201,
      "Inventory item added successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateItem: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    const { name, quantity } = req.body;

    // Retrieve the existing inventory item from the database
    let item = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    // Update the inventory item in the database
    item = await prisma.inventoryItem.update({
      where: {
        id: itemId,
      },
      data: {
        name: name || item.name,
        quantity: quantity || item.quantity,
      },
    });

    ResponseHandler.success(
      res,
      item,
      200,
      "Inventory item updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteItem: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = parseInt(req.params.id, 10);

    // Delete the inventory item from the database
    await prisma.inventoryItem.delete({
      where: {
        id: itemId,
      },
    });

    ResponseHandler.success(
      res,
      {},
      200,
      "Inventory item deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};
