scriptsDir=$(dirname "$BASH_SOURCE")
configFile="/tmp/config"
cat "$scriptsDir/config.sh" > "$configFile"
source /tmp/config
rm -f $configFile