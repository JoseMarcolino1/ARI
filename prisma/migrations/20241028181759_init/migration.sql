/*
  Warnings:

  - You are about to drop the column `frequencia` on the `Prescricao` table. All the data in the column will be lost.
  - Added the required column `frequencia_unidade` to the `Prescricao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequencia_valor` to the `Prescricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prescricao" DROP COLUMN "frequencia",
ADD COLUMN     "frequencia_unidade" TEXT NOT NULL,
ADD COLUMN     "frequencia_valor" INTEGER NOT NULL;
