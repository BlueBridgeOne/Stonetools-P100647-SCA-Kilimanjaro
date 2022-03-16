#!/usr/bin/env bash


printf "\n"
printf "\e[1;32mBuild NetSuite\e[0m\n"
printf "\e[0;32m--------------\e[0m\n"
printf "\n"

printf "\e[0;34mCompile Typescript\e[0m\n"
tsc  ./src/catalogueCSV/c25_catalogue_mr.ts --outFile ./dist/c25_catalogue_mr.js
tsc  ./src/CleanCustomers/c25_cleancustomers_ue.ts --outFile ./dist/c25_cleancustomers_ue.js
tsc  ./src/CleanCustomers/c25_cleancustomers_mr.ts --outFile ./dist/c25_cleancustomers_mr.js

printf "done.\n\n"

exit

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT
