"""Build an explicit static payload for GitHub Pages."""
import shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=root/'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in ['index.html','app.js','model.js','style.css']:
 shutil.copy2(root/name,out/name)
shutil.copytree(root/'data',out/'data',ignore=shutil.ignore_patterns('.DS_Store'))
(out/'.nojekyll').touch()
assert (out/'index.html').is_file()
print('Built static site in dist/')
