-- Add missing RLS policies for drone_patrols table to allow admins to manage patrols

-- Allow admins to insert patrol records
CREATE POLICY "Admins can create drone patrols"
  ON drone_patrols FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Allow admins to update patrol records
CREATE POLICY "Admins can update drone patrols"
  ON drone_patrols FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Allow admins to delete patrol records
CREATE POLICY "Admins can delete drone patrols"
  ON drone_patrols FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));