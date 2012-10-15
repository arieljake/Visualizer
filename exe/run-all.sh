scriptsDir=$(dirname "$BASH_SOURCE")
"$scriptsDir/gearmand.sh" &
"$scriptsDir/mongo.sh" &
"$scriptsDir/neo4j.sh" &
node /Users/arieljake/Documents/Projects/Gearman/workers/dev/dev-listWorkersInDir.js &
node /Users/arieljake/Documents/Projects/Gearman/www/admin/workers.js
