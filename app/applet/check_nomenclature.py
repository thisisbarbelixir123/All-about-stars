import re

for fpath in ['src/data/stellarNomenclatureData.ts', 'src/components/StellarNomenclatureGuide.tsx']:
  with open(fpath, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
      line_str = line.strip()
      if '\\text' in line_str or '\\dots' in line_str or '\\alpha' in line_str:
        print(f"TeX: {fpath}:{idx+1}: {line_str}")
      if re.search(r'\$[a-zA-Z0-9\\_{^}]+\$', line_str):
        print(f"Dollar math: {fpath}:{idx+1}: {line_str}")
