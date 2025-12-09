-- 1. Table: vendor
-- Tabel ini harus dibuat duluan karena direferensikan oleh menu, tray, dan review.
CREATE TABLE public.vendor (
    vendor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

-- 2. Table: nis_lookup
CREATE TABLE public.nis_lookup (
    nis VARCHAR(12) PRIMARY KEY
);

-- 3. Table: food_material
CREATE TABLE public.food_material (
    food_material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    calories REAL,
    fat REAL,
    protein REAL,
    carbohydrate REAL,
    class TEXT
);

-- 4. Table: food_issue
CREATE TABLE public.food_issue (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_name VARCHAR(32)
);

-- 5. Table: menu
-- Mereferensikan tabel vendor
CREATE TABLE public.menu (
    menu_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE,
    foods TEXT[], -- Tipe data Array
    vendor_id UUID,
    CONSTRAINT menu_vendor_fk FOREIGN KEY (vendor_id) REFERENCES public.vendor(vendor_id)
);

-- 6. Table: tray
-- Mereferensikan tabel vendor dengan ON DELETE CASCADE
CREATE TABLE public.tray (
    tray_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    date DATE NOT NULL,
    calories NUMERIC NOT NULL,
    fat NUMERIC NOT NULL,
    protein NUMERIC NOT NULL,
    carbohydrate NUMERIC NOT NULL,
    image TEXT NOT NULL,
    compliance_score REAL NOT NULL,
    CONSTRAINT c1 FOREIGN KEY (vendor_id) REFERENCES public.vendor(vendor_id) ON DELETE CASCADE
);

-- 7. Table: review
-- Mereferensikan tabel vendor dengan ON DELETE CASCADE
CREATE TABLE public.review (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    rating NUMERIC NOT NULL,
    message TEXT NOT NULL,
    date DATE NOT NULL,
    nis VARCHAR(12) NOT NULL,
    issue_id TEXT[], -- Tipe data Array
    CONSTRAINT fk_ven_id FOREIGN KEY (vendor_id) REFERENCES public.vendor(vendor_id) ON DELETE CASCADE
);