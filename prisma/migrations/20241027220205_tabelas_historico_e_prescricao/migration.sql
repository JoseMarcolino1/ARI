-- CreateTable
CREATE TABLE "Prescricao" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "observacao" TEXT,
    "id_remedio" INTEGER NOT NULL,
    "frequencia" TIMESTAMP(3) NOT NULL,
    "dt_inicio" TIMESTAMP(3) NOT NULL,
    "dt_fim" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Prescricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "id_prescricao" INTEGER NOT NULL,
    "dt_atual" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prescricao" ADD CONSTRAINT "Prescricao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescricao" ADD CONSTRAINT "Prescricao_id_remedio_fkey" FOREIGN KEY ("id_remedio") REFERENCES "Remedio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_id_prescricao_fkey" FOREIGN KEY ("id_prescricao") REFERENCES "Prescricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
