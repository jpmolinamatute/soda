#!/usr/bin/env bash

SRCDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bundle="${SRCDIR}/bundle"
tarball="${SRCDIR}/soda.tar.gz"

if [[ -f $tarball ]]; then
	echo "Stopping soda"
	sudo systemctl stop soda.service
	if [[ -d $bundle ]]; then
		rm -rf "$bundle"
	fi
	tar -xf "$tarball"
	cd "${bundle}/programs/server" || exit 2
	if ! npm install; then
		echo "Error: 'npm install' failed" >&2
		exit 2
	fi
	if ! npm audit fix; then
		echo "Error: 'npm audit fix' failed" >&2
		exit 2
	fi
	echo "Starting soda"
	sudo systemctl start soda.service
fi
echo "Bye!"
exit 0
