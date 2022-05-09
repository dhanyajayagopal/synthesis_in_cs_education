.PHONY: versions
versions:
	bash scripts/make-versions.sh

.PHONY: serve
serve:
	python3 serve.py

.PHONY: online
online:
	ngrok http 9090
