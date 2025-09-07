-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "shipping_adress" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL
);
