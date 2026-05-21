/*
  # Add Admin Write Policies

  1. Security Changes
    - Add INSERT/UPDATE/DELETE policies for products table (admin only)
    - Add UPDATE/DELETE policies for orders table (admin only)
    - Add SELECT/INSERT policies for order_items (admin only)
    - Add SELECT policy for contact_messages (admin only)
    - Add SELECT policy for profiles (admin only)
    - Add INSERT/UPDATE/DELETE policies for categories (admin only)

  These policies check if the authenticated user's profile has is_admin = true.
  Uses a subquery to verify admin status.
*/

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Products admin policies
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- Categories admin policies
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());

-- Orders admin policies
CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Order items admin policies
CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Contact messages admin read policy
CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

-- Profiles admin read policy
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());
