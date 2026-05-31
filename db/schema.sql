-- Tabel tasks
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    definition_of_done TEXT NOT NULL,
    menu_category TEXT CHECK(menu_category IN ('APPETIZER', 'MAIN', 'DESSERT', 'SIDE')) NOT NULL,
    energy_required TEXT CHECK(energy_required IN ('LOW', 'MEDIUM', 'HIGH')) NOT NULL,
    interest_level INTEGER CHECK(interest_level >= 1 AND interest_level <= 5) NOT NULL,
    status TEXT CHECK(status IN ('BACKLOG', 'QUEUE', 'COMPLETED', 'ABANDONED')) NOT NULL DEFAULT 'BACKLOG',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger untuk update updated_at secara otomatis saat terjadi update
CREATE TRIGGER update_tasks_updated_at
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
