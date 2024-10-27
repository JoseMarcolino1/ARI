-- CreateTable
CREATE TABLE "Remedio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "dosagem" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Remedio_pkey" PRIMARY KEY ("id")
);
