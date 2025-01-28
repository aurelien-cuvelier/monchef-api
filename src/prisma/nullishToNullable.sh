#!/bin/bash


# zod-prisma will evaluate Prisma's "String?" to Zod's "nullish()" which is
# evaluating to "string | null | undefined", which is not compatible with Prisma's
# generated type evaluation which is "string | null". That's why after each
# prisma generation, nullishToNullable.sh HAS TO be ran as we rely on these zod objects
# to construct schemas for the API.


# Define the directory (default to "zod" if not passed)
DIRECTORY="${1:-zod}"

# Check if running on macOS or Linux and set sed options accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS: use sed with an empty string for in-place editing
    SED_OPTS='-i ""'
else
    # Linux: use sed with -i without an argument
    SED_OPTS='-i'
fi

# Use find to locate all .ts files and replace .nullish() with .nullable()
find "$DIRECTORY" -type f -name "*.ts" -exec sed $SED_OPTS 's/\.nullish()/.nullable()/g' {} +

echo isouuuu