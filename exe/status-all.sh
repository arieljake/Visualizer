printProcessStatus()
{
    echo "$1 " $(ps aux | grep $1 | grep -v grep | wc -l)
}

printProcessStatus "gearmand"
printProcessStatus "mongod"
printProcessStatus "neo4j"
printProcessStatus "listWorkersInDir.js"
printProcessStatus "workers.js"

