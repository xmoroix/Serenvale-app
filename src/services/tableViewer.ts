class TableViewerService {
  async getAllTables() {
    const res = await fetch('/api/pglite/tables');
    return res.json();
  }

  async getTableDetails(tableName: string) {
    const res = await fetch(`/api/pglite/tables/${tableName}/columns`);
    return res.json();
  }

  async getTableData(tableName: string) {
    const res = await fetch(`/api/pglite/tables/${tableName}/data`);
    return res.json();
  }
}

export const tableViewerService = new TableViewerService();
