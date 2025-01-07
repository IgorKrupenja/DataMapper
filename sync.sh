#!/bin/bash

# Debugging function to print the command being run
debug_log() {
  echo "Running command: $1"
}

# Intents
for file in /rasa/locations/data/nlu/* ; do
  if [ -f "$file" ]; then
    debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/put/intents/intent -F input=@$file"
    curl -X POST http://module-byk-training-gui-pipelines:3010/put/intents/intent -F "input=@$file"
  else
    echo "File not found or not readable: $file"
  fi
done

# Rules
RULES_FILE="/rasa/locations/data/rules.yml"
if [ -f "$RULES_FILE" ]; then
  debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/rules/rule -F input=@$RULES_FILE"
  curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/rules/rule -F "input=@$RULES_FILE"
else
  echo "Rules file not found or not readable: $RULES_FILE"
fi

# Stories
STORIES_FILE="/rasa/locations/data/stories.yml"
if [ -f "$STORIES_FILE" ]; then
  debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/stories/story -F input=@$STORIES_FILE"
  curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/stories/story -F "input=@$STORIES_FILE"
else
  echo "Stories file not found or not readable: $STORIES_FILE"
fi

# Regexes
for file in /rasa/locations/data/regex/* ; do
  if [ -f "$file" ]; then
    debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/put/regexes/regex -F input=@$file"
    curl -X POST http://module-byk-training-gui-pipelines:3010/put/regexes/regex -F "input=@$file"
  else
    echo "File not found or not readable: $file"
  fi
done

# Domain
DOMAIN_FILE="/rasa/locations/data/domain.yml"
if [ -f "$DOMAIN_FILE" ]; then
  debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/domain -F input=@$DOMAIN_FILE"
  curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/domain -F "input=@$DOMAIN_FILE"
else
  echo "Domain file not found or not readable: $DOMAIN_FILE"
fi

# Config
CONFIG_FILE="/rasa/locations/data/config.yml"
if [ -f "$CONFIG_FILE" ]; then
  debug_log "curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/config -F input=@$CONFIG_FILE"
  curl -X POST http://module-byk-training-gui-pipelines:3010/bulk/config -F "input=@$CONFIG_FILE"
else
  echo "Config file not found or not readable: $CONFIG_FILE"
fi
