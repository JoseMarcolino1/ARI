/*
  Warnings:

  - Changed the type of `funcao` on the `Remedio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dosagem` on the `Remedio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Remedio" DROP COLUMN "funcao",
ADD COLUMN     "funcao" INTEGER NOT NULL,
DROP COLUMN "dosagem",
ADD COLUMN     "dosagem" DOUBLE PRECISION NOT NULL;
