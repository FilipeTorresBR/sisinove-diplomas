import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  listDiplomas,
  createDiploma,
  updateDiploma,
  deleteDiploma,
  uploadAttachments,
  downloadProof,
  exportCsv,
  exportPdf,
} from "../controllers/diplomaController.js";
const router = Router();
router.get("/export/csv", auth(), exportCsv);
router.get("/export/pdf", auth(), exportPdf);
router.get("/", auth(), listDiplomas);
router.post("/", auth(["admin", "secretaria"]), createDiploma);
router.put("/:id", auth(["admin", "secretaria"]), updateDiploma);
router.delete("/:id", auth(["admin"]), deleteDiploma);
router.post(
  "/:id/attachments",
  auth(["admin", "secretaria"]),
  upload.array("files", 10),
  uploadAttachments,
);
router.get("/:id/proof", auth(), downloadProof);
export default router;
