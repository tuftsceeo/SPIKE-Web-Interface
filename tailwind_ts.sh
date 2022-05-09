echo "--------------------------------------------"
echo "Running TS Compiler"
tsc --target ES6 ./server/examples/unit_test/servicedock_unit_test_2.ts ./server/examples/unit_test/unit_test.ts ./server/examples/unit_test/test_classes.ts ./server/examples/unit_test/unit_test_3.ts > output.txt

if [ "$(head -1 output.txt)" != "" ]
then
    echo "Errors Detected"
else
    echo "No Errors Detected"
fi

echo ""
echo "Running Tailwind"
npx tailwindcss -i ./server/examples/unit_test/input.css -o ./server/examples/unit_test/output.css

rm output.txt

echo "--------------------------------------------"