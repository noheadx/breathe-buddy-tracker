-- Change condition field from text to integer for numeric scale 1-10
ALTER TABLE peak_flow_entries 
ALTER COLUMN condition TYPE integer USING 
  CASE 
    WHEN condition = 'good' THEN 10
    WHEN condition = 'moderate' THEN 5
    WHEN condition = 'poor' THEN 1
    ELSE NULL
  END;