/*
  Warnings:

  - Added the required column `product_quantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "shipping_adress" TEXT NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL
);
INSERT INTO "new_Order" ("id", "order_date", "product_id", "shipping_adress") SELECT "id", "order_date", "product_id", "shipping_adress" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
