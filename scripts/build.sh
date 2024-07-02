#!/usr/bin/env sh

if [ $# -eq 0 ]; then
	set -- modules/*
fi

# shellcheck source=/dev/null
. ./scripts/VARS.sh

for DIR; do
	MODULE="$(basename "${DIR}")"
	ID="$(get_id "${MODULE}")"
	echo "Building ${ID}"
	deno run -A jsr:@delu/tailor/cli --module "${ID}" -i "${DIR}" -o "${DIR}" -b &
done

wait

echo "Done"
