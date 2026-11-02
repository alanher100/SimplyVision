"""Point every sidebar link to the real page. Run from the repo root: python3 fix_sidebar_links.py
Only changes href="#" on the six sidebar links. Nothing else in the files is touched."""
import os, re

PAGES = {
    "Dashboard": "dashboard/index.html",
    "Upload Footage": "upload-footage-review/uploadfootage.html",
    "AI Processing": "dashboard/ai-processing.html",
    "Editor Review": "editor-review/editor-review.html",
    "Candidate Clips": "frontend/candidate-clips/index.html",
    "Video Library": "video-library/index.html",
}
FILES = [p for p in PAGES.values() if p != "dashboard/ai-processing.html"]
pattern = re.compile(r'<a href="#"([^>]*)>(\s*)(' + "|".join(PAGES) + r')\b')

for path in FILES:
    if not os.path.exists(path):
        print("missing:", path)
        continue
    folder = os.path.dirname(path)
    text = open(path, encoding="utf-8").read()

    def swap(m):
        target = os.path.relpath(PAGES[m.group(3)], folder)
        return '<a href="%s"%s>%s%s' % (target, m.group(1), m.group(2), m.group(3))

    new, count = pattern.subn(swap, text)
    open(path, "w", encoding="utf-8").write(new)
    print("%-45s %d links updated" % (path, count))
