import { FindAttributeOptions, Includeable } from "sequelize";
import * as CategoryModel from "../models/Category";

const Category: any = (CategoryModel as any).default || (CategoryModel as any).Category;

export type CategoryPayload = {
  name: string;
  parentId?: number | null;
};

const baseAttrs: FindAttributeOptions = ["id", "name", "parentId", "createdAt", "updatedAt"];

function buildInclude(): Includeable[] {
  return [
    {
      model: Category,
      as: "parent",
      attributes: ["id", "name", "parentId"],
      required: false,
    },
  ];
}

export async function createCategorySvc(payload: CategoryPayload) {
  if (payload.parentId) {
    const parent = await Category.findByPk(payload.parentId);
    if (!parent) {
      const err: any = new Error("Parent category not found");
      err.status = 400;
      throw err;
    }
  }
  return Category.create(payload);
}

export async function updateCategorySvc(id: number, payload: Partial<CategoryPayload>) {
  const category = await Category.findByPk(id);
  if (!category) {
    const err: any = new Error("Category not found");
    err.status = 404;
    throw err;
  }

  if (payload.parentId !== undefined && payload.parentId !== null) {
    if (payload.parentId === id) {
      const err: any = new Error("Category cannot be its own parent");
      err.status = 400;
      throw err;
    }
    const parent = await Category.findByPk(payload.parentId);
    if (!parent) {
      const err: any = new Error("Parent category not found");
      err.status = 400;
      throw err;
    }
  }

  await category.update(payload);
  return category;
}

export async function getAllCategoriesSvc() {
  return Category.findAll({
    attributes: baseAttrs,
    include: buildInclude(),
    order: [["createdAt", "DESC"]],
  });
}
