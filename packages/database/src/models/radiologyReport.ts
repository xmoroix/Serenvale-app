import { and, desc, eq, inArray, like } from 'drizzle-orm';

import {
  NewPacsWorklistEntry,
  NewRadiologyReport,
  PacsWorklistEntry,
  RadiologyReport,
  pacsWorklist,
  radiologyReports,
} from '../schemas/radiology';
import { LobeChatDatabase } from '../type';

export class RadiologyReportModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  // ========= CREATE ========= //

  create = async (params: Omit<NewRadiologyReport, 'userId'>) => {
    const [result] = await this.db
      .insert(radiologyReports)
      .values({ ...params, userId: this.userId })
      .returning();

    return result;
  };

  // ========= QUERY ========= //

  query = async () => {
    return this.db.query.radiologyReports.findMany({
      orderBy: [desc(radiologyReports.createdAt)],
      where: eq(radiologyReports.userId, this.userId),
    });
  };

  findById = async (id: string) => {
    return this.db.query.radiologyReports.findFirst({
      where: and(eq(radiologyReports.id, id), eq(radiologyReports.userId, this.userId)),
    });
  };

  findByPatientId = async (patientId: string) => {
    return this.db.query.radiologyReports.findMany({
      orderBy: [desc(radiologyReports.createdAt)],
      where: and(
        eq(radiologyReports.patientId, patientId),
        eq(radiologyReports.userId, this.userId),
      ),
    });
  };

  findByStatus = async (status: string) => {
    return this.db.query.radiologyReports.findMany({
      orderBy: [desc(radiologyReports.createdAt)],
      where: and(eq(radiologyReports.status, status), eq(radiologyReports.userId, this.userId)),
    });
  };

  findByAccessionNumber = async (accessionNumber: string) => {
    return this.db.query.radiologyReports.findFirst({
      where: and(
        eq(radiologyReports.accessionNumber, accessionNumber),
        eq(radiologyReports.userId, this.userId),
      ),
    });
  };

  searchByPatientName = async (patientName: string) => {
    return this.db.query.radiologyReports.findMany({
      orderBy: [desc(radiologyReports.createdAt)],
      where: and(
        like(radiologyReports.patientName, `%${patientName}%`),
        eq(radiologyReports.userId, this.userId),
      ),
    });
  };

  // ========= UPDATE ========= //

  update = async (id: string, value: Partial<RadiologyReport>) => {
    return this.db
      .update(radiologyReports)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(radiologyReports.id, id), eq(radiologyReports.userId, this.userId)));
  };

  updateStatus = async (id: string, status: string) => {
    const updates: Partial<RadiologyReport> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    } else if (status === 'signed') {
      updates.signedAt = new Date().toISOString();
    }

    return this.db
      .update(radiologyReports)
      .set(updates)
      .where(and(eq(radiologyReports.id, id), eq(radiologyReports.userId, this.userId)));
  };

  // ========= DELETE ========= //

  delete = async (id: string) => {
    return this.db
      .delete(radiologyReports)
      .where(and(eq(radiologyReports.id, id), eq(radiologyReports.userId, this.userId)));
  };

  deleteAll = async () => {
    return this.db.delete(radiologyReports).where(eq(radiologyReports.userId, this.userId));
  };

  deleteBatch = async (ids: string[]) => {
    return this.db
      .delete(radiologyReports)
      .where(and(inArray(radiologyReports.id, ids), eq(radiologyReports.userId, this.userId)));
  };
}

/**
 * PACS Worklist Model
 * For caching DICOM worklist queries
 */
export class PacsWorklistModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  // ========= CREATE ========= //

  create = async (params: Omit<NewPacsWorklistEntry, 'userId'>) => {
    const [result] = await this.db
      .insert(pacsWorklist)
      .values({ ...params, userId: this.userId })
      .returning();

    return result;
  };

  createBatch = async (entries: Omit<NewPacsWorklistEntry, 'userId'>[]) => {
    return this.db
      .insert(pacsWorklist)
      .values(entries.map((entry) => ({ ...entry, userId: this.userId })))
      .returning();
  };

  // ========= QUERY ========= //

  query = async () => {
    return this.db.query.pacsWorklist.findMany({
      orderBy: [desc(pacsWorklist.studyDate)],
      where: eq(pacsWorklist.userId, this.userId),
    });
  };

  findById = async (id: string) => {
    return this.db.query.pacsWorklist.findFirst({
      where: and(eq(pacsWorklist.id, id), eq(pacsWorklist.userId, this.userId)),
    });
  };

  findByStudyUid = async (studyInstanceUid: string) => {
    return this.db.query.pacsWorklist.findFirst({
      where: and(
        eq(pacsWorklist.studyInstanceUid, studyInstanceUid),
        eq(pacsWorklist.userId, this.userId),
      ),
    });
  };

  findByPatientId = async (patientId: string) => {
    return this.db.query.pacsWorklist.findMany({
      orderBy: [desc(pacsWorklist.studyDate)],
      where: and(eq(pacsWorklist.patientId, patientId), eq(pacsWorklist.userId, this.userId)),
    });
  };

  findByDate = async (studyDate: string) => {
    return this.db.query.pacsWorklist.findMany({
      orderBy: [desc(pacsWorklist.studyTime)],
      where: and(eq(pacsWorklist.studyDate, studyDate), eq(pacsWorklist.userId, this.userId)),
    });
  };

  // ========= UPDATE ========= //

  update = async (id: string, value: Partial<PacsWorklistEntry>) => {
    return this.db
      .update(pacsWorklist)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(pacsWorklist.id, id), eq(pacsWorklist.userId, this.userId)));
  };

  // ========= DELETE ========= //

  delete = async (id: string) => {
    return this.db
      .delete(pacsWorklist)
      .where(and(eq(pacsWorklist.id, id), eq(pacsWorklist.userId, this.userId)));
  };

  deleteAll = async () => {
    return this.db.delete(pacsWorklist).where(eq(pacsWorklist.userId, this.userId));
  };

  // Clear old worklist entries (for caching)
  deleteOlderThan = async (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.db
      .delete(pacsWorklist)
      .where(
        and(
          eq(pacsWorklist.userId, this.userId),
          // @ts-ignore
          lt(pacsWorklist.createdAt, cutoffDate.toISOString()),
        ),
      );
  };
}
