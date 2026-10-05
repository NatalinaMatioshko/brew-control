-- CreateEnum
CREATE TYPE "ChecklistKind" AS ENUM ('OPENING', 'CLOSING');

-- CreateEnum
CREATE TYPE "ChecklistRunStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "checklist_templates" (
    "id" TEXT NOT NULL,
    "kind" "ChecklistKind" NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_template_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "template_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_runs" (
    "id" TEXT NOT NULL,
    "status" "ChecklistRunStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "service_date" DATE NOT NULL,
    "title_snapshot" TEXT NOT NULL,
    "kind_snapshot" "ChecklistKind" NOT NULL,
    "template_id" TEXT NOT NULL,
    "started_by_id" TEXT NOT NULL,
    "completed_by_id" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_run_items" (
    "id" TEXT NOT NULL,
    "title_snapshot" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "checked_at" TIMESTAMP(3),
    "template_item_id" TEXT,
    "checked_by_id" TEXT,
    "run_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_run_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "checklist_templates_kind_is_active_idx" ON "checklist_templates"("kind", "is_active");

-- CreateIndex
CREATE INDEX "checklist_template_items_template_id_sort_order_idx" ON "checklist_template_items"("template_id", "sort_order");

-- CreateIndex
CREATE INDEX "checklist_runs_service_date_kind_snapshot_idx" ON "checklist_runs"("service_date", "kind_snapshot");

-- CreateIndex
CREATE INDEX "checklist_runs_status_service_date_idx" ON "checklist_runs"("status", "service_date");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_runs_template_id_service_date_key" ON "checklist_runs"("template_id", "service_date");

-- CreateIndex
CREATE INDEX "checklist_run_items_run_id_sort_order_idx" ON "checklist_run_items"("run_id", "sort_order");

-- AddForeignKey
ALTER TABLE "checklist_template_items" ADD CONSTRAINT "checklist_template_items_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "checklist_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_runs" ADD CONSTRAINT "checklist_runs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "checklist_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_runs" ADD CONSTRAINT "checklist_runs_started_by_id_fkey" FOREIGN KEY ("started_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_runs" ADD CONSTRAINT "checklist_runs_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_run_items" ADD CONSTRAINT "checklist_run_items_checked_by_id_fkey" FOREIGN KEY ("checked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_run_items" ADD CONSTRAINT "checklist_run_items_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "checklist_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
