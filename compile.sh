mkdir compiled
rm compiled/* -r

cp index.html compiled/
cp main.css compiled/
cp fantasydog.json compiled/

cat *.js > compiled/breeding.js
curl -X POST -s --data-urlencode 'input@compiled/breeding.js' https://javascript-minifier.com/raw > compiled/breeding.min.js
rm compiled/breeding.js
