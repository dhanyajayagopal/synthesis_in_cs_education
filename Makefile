.PHONY: versions
versions:
	./make-versions.sh

.PHONY: serve
serve:
	python3 serve.py
