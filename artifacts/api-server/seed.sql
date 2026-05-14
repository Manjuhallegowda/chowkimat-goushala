-- Seed the super admin user
-- Default password: "admin123" (SHA-256 hash)
-- CHANGE THIS IMMEDIATELY after first login!
INSERT OR IGNORE INTO admins (username, password_hash, role, can_manage_admins, can_edit_financials, can_edit_site_settings, can_edit_gallery)
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'super_admin', 1, 1, 1, 1);

-- Seed default site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('address_line1', 'Sri Gosuala Temple Road');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('address_line2', 'Near Ancient Stone Pillar');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('address_city', 'Mysuru District, Karnataka');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('address_pincode', '570001');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('address_country', 'India');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contact_phone', '+91 98765 43210');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contact_email', 'contact@gosuala.org');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('contact_hours', '6:00 AM - 6:00 PM (Daily)');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('map_embed_url', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bank_name', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bank_account_name', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bank_account_number', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bank_ifsc', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('bank_branch', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('upi_id', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('qr_code_key', '');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('qr_code_url', '');
