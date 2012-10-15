
getProcessPID()
{
    echo `ps aux | grep $1 | grep -v grep | awk '{print $2}'`
}

killProcess()
{
    local pid=$(getProcessPID $1)

    if [ ${#pid} != '0' ]; then
        kill $pid
    fi
}

stopProcess()
{
    local pid=$(getProcessPID $1)

    if [ ${#pid} != '0' ]; then
        `$2`
    fi
}

stopProcess neo4j "neo4j stop"
killProcess mongod
killProcess gearmand
killall node