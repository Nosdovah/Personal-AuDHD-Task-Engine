-- Tabel tasks (PostgreSQL compatible for Supabase)
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    definition_of_done TEXT NOT NULL,
    menu_category TEXT CHECK(menu_category IN ('APPETIZER', 'MAIN', 'DESSERT', 'SIDE')) NOT NULL,
    energy_required TEXT CHECK(energy_required IN ('LOW', 'MEDIUM', 'HIGH')) NOT NULL,
    interest_level INTEGER CHECK(interest_level >= 1 AND interest_level <= 5) NOT NULL,
    status TEXT CHECK(status IN ('BACKLOG', 'QUEUE', 'COMPLETED', 'ABANDONED')) NOT NULL DEFAULT 'BACKLOG',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function untuk update updated_at secara otomatis saat terjadi update
CREATE OR REPLACE FUNCTION update_tasks_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk memanggil function di atas
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_tasks_updated_at_column();
