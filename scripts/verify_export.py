"""Run after node tests, which write a representative CSV through the app serializer."""
import csv
from pathlib import Path
root=Path(__file__).resolve().parents[1]
with (root/'data/original/FAOSTAT Data Nov 16 2026(1).csv').open(encoding='utf-8-sig',newline='') as f:
 original=list(csv.DictReader(f))
with Path('/tmp/faostat-export-roundtrip.csv').open(encoding='utf-8',newline='') as f:
 exported=list(csv.DictReader(f))
assert original==exported, 'CSV export changed original field contents'
print(f'CSV export round-trip passed: {len(original)} rows, all original fields equal')
