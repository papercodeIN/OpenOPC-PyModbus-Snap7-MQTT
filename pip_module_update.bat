python -m pip install --upgrade pip
pip list --outdated
for /f %i in ('pip list --outdated --format=json ^| python -c "import sys,json;print('\n'.join(p['name'] for p in json.load(sys.stdin)))"') do pip install -U %i